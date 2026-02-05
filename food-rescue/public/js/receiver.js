const auth = firebase.auth();
const db = firebase.firestore();

const me = document.getElementById("me");
const list = document.getElementById("list");
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "/index.html";
});

auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "/index.html";
    return;
  }

  // get receiver profile
  const userDoc = await db.collection("users").doc(user.uid).get();
  if (!userDoc.exists) {
    me.textContent = "No user profile found.";
    return;
  }

  const profile = userDoc.data();
  if (profile.role !== "receiver") {
    me.textContent = "This account is not a receiver.";
    return;
  }

  const orgId = profile.orgId;
  me.textContent = `Logged in as ${user.email}`;

  // listen for proposed matches
  db.collection("matches")
    .where("orgId", "==", orgId)
    .where("status", "==", "proposed")
    .onSnapshot(async (snap) => {
      list.innerHTML = "";

      if (snap.empty) {
        list.textContent = "No proposed matches yet.";
        return;
      }

      for (const doc of snap.docs) {
        const match = doc.data();

        let desc = "";
        if (match.donationId) {
          const d = await db.collection("donations").doc(match.donationId).get();
          desc = d.exists ? d.data().description || "" : "";
        }

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <div><b>Donation:</b> ${desc || match.donationId}</div>
          <div><b>Distance:</b> ${match.distanceKm?.toFixed(2) || "—"} km</div>
          <div><b>Why matched:</b> ${match.whyMatched || "—"}</div>
          <button data-id="${doc.id}" data-action="accept">Accept</button>
          <button data-id="${doc.id}" data-action="reject">Reject</button>
        `;

        list.appendChild(card);
      }
    });

  // accept / reject handler
  list.addEventListener("click", async (e) => {
    if (e.target.tagName !== "BUTTON") return;

    const matchId = e.target.dataset.id;
    const action = e.target.dataset.action;

    const matchRef = db.collection("matches").doc(matchId);
    const matchDoc = await matchRef.get();
    if (!matchDoc.exists) return;

    const match = matchDoc.data();

    await matchRef.update({
      status: action === "accept" ? "accepted" : "rejected",
      decidedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    if (match.donationId) {
      await db.collection("donations").doc(match.donationId).update({
        status: action === "accept" ? "accepted" : "rejected",
      });
    }
  });
});