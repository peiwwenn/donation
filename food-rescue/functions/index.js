const functions = require("firebase-functions/v1");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();

const GEMINI_API_KEY = defineSecret("GEMINI_API_KEY");

// Haversine distance (km)
function distance(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const toRad = (x) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return 2 * R * Math.asin(Math.sqrt(a));
}

// Call Gemini (Google AI only) to classify donation description
async function classifyDonationWithGemini({ apiKey, description }) {
  const prompt = `
You are classifying donation items for a donation-matching system.
Return ONLY valid JSON (no markdown, no extra text).

Schema:
{
  "tags": ["food_human"|"necessities"|"school_supplies"|"pet_supplies"|"other"],
  "eligibleOrgTypes": ["orphanage","oldfolks","animal"],
  "acceptance": "accepted"|"not_accepted"|"needs_review",
  "reason": "short reason (<=20 words)",
  "safetyNotes": ["short note 1", "short note 2"]
}

Rules:
- If item is clearly expired, opened perishable food, or unsafe: acceptance="not_accepted"
- If unclear: acceptance="needs_review"
- Human food usually eligible: orphanage/oldfolks
- Pet items: eligible includes animal
- Daily necessities: orphanage/oldfolks/animal depending on item

Item description: ${JSON.stringify(description)}
`;

  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2 },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${errText}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Parse JSON strictly, with a safe fallback extraction
  try {
    return JSON.parse(text);
  } catch (e) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      return JSON.parse(text.slice(start, end + 1));
    }
    throw new Error("Gemini returned non-JSON output");
  }
}

exports.matchNearestOrg = functions
  .runWith({ secrets: [GEMINI_API_KEY] })
  .firestore.document("donations/{donationId}")
  .onCreate(async (snap, context) => {
    const donation = snap.data();
    const loc = donation?.location;

    if (!loc || typeof loc.lat !== "number" || typeof loc.lng !== "number") {
      console.log("Donation missing valid location:", context.params.donationId);
      return null;
    }

    // 1) Gemini classification
    const geminiKey = GEMINI_API_KEY.value();
    let ai;

    try {
      ai = await classifyDonationWithGemini({
        apiKey: geminiKey,
        description: donation?.description || "",
      });
    } catch (err) {
      console.error("Gemini classify failed:", err);
      // Still allow fallback matching (no filter), but mark AI status
      await snap.ref.update({
        aiError: true,
        aiErrorMessage: String(err.message || err),
        status: "pending_ai_failed",
      });
      return null;
    }

    const aiTags = Array.isArray(ai?.tags) ? ai.tags : [];
    const eligibleTypes = Array.isArray(ai?.eligibleOrgTypes) ? ai.eligibleOrgTypes : [];
    const acceptance = ai?.acceptance || "needs_review";
    const reason = ai?.reason || "";
    const safetyNotes = Array.isArray(ai?.safetyNotes) ? ai.safetyNotes : [];

    // Save AI result on donation (for explainability)
    await snap.ref.update({
      aiTags,
      aiEligibleOrgTypes: eligibleTypes,
      aiAcceptance: acceptance,
      aiReason: reason,
      aiSafetyNotes: safetyNotes,
    });

    // Optional: stop if AI says not accepted
    if (acceptance === "not_accepted") {
      await snap.ref.update({
        status: "rejected_by_ai",
        matchedOrgId: null,
        matchedOrgName: null,
      });
      return null;
    }

    // 2) Load orgs
    const orgSnap = await admin.firestore().collection("organizations").get();
    if (orgSnap.empty) {
      await snap.ref.update({ status: "no_orgs_available" });
      return null;
    }

    // 3) Filter orgs by type + acceptedTags
    const eligibleOrgs = [];
    orgSnap.forEach((doc) => {
      const org = doc.data();
      const oLoc = org?.location;

      if (!oLoc || typeof oLoc.lat !== "number" || typeof oLoc.lng !== "number") return;

      const orgType = org?.type; // "orphanage" | "oldfolks" | "animal"
      const acceptedTags = Array.isArray(org?.acceptedTags) ? org.acceptedTags : [];

      const typeOk = eligibleTypes.length === 0 ? true : eligibleTypes.includes(orgType);
      const tagOk = aiTags.length === 0 ? true : aiTags.some((t) => acceptedTags.includes(t));

      if (typeOk && tagOk) {
        eligibleOrgs.push({ id: doc.id, name: org.name || "", type: orgType, location: oLoc });
      }
    });

    if (eligibleOrgs.length === 0) {
      await snap.ref.update({
        status: "no_eligible_org_found",
        matchedOrgId: null,
        matchedOrgName: null,
      });
      return null;
    }

    // 4) Nearest among eligible
    let nearest = null;
    let best = Infinity;

    for (const org of eligibleOrgs) {
      const d = distance(loc.lat, loc.lng, org.location.lat, org.location.lng);
      if (d < best) {
        best = d;
        nearest = org;
      }
    }

    if (!nearest) {
      await snap.ref.update({ status: "match_failed" });
      return null;
    }

    // 5) Create match with "why matched"
    await admin.firestore().collection("matches").add({
      donationId: context.params.donationId,
      orgId: nearest.id,
      orgName: nearest.name,
      orgType: nearest.type,
      distanceKm: best,
      status: "proposed",
      whyMatched: {
        aiTags,
        eligibleOrgTypes: eligibleTypes,
        aiReason: reason,
      },
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 6) Update donation status
    await snap.ref.update({
      status: "matched",
      matchedOrgId: nearest.id,
      matchedOrgName: nearest.name,
      matchedOrgType: nearest.type,
      matchedDistanceKm: best,
      matchedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return null;
  });