import { auth, db } from "./firebase.js";

import { requireAuth } from "./guard.js";
requireAuth();

import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Get form + UI elements
const form = document.getElementById("donateForm");
const loadingBox = form.querySelector(".loading");
const sentBox = form.querySelector(".sent-message");
const errorBox = form.querySelector(".error-message");

// Hide messages initially
loadingBox.style.display = "none";
sentBox.style.display = "none";
errorBox.style.display = "none";

let currentUser = null;

// Track logged-in user (optional but recommended)
onAuthStateChanged(auth, (user) => {
  currentUser = user;
});

// Handle form submit
form.addEventListener("submit", async (e) => {
  e.preventDefault(); // 🚫 stop page refresh

  loadingBox.style.display = "block";
  sentBox.style.display = "none";
  errorBox.style.display = "none";

  try {
    // ✅ LOGIN CHECK GOES HERE
    if (!currentUser) {
      const here = "index.html";
      window.location.href = `login.html?redirect=${encodeURIComponent(here)}`;
      return;
      //throw new Error("Please login before submitting a donation.");
    }
    
    // Read form values
    const donationData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),

      donationType: document.getElementById("donation_type").value,
      pickupDate: document.getElementById("pickup_date").value,
      pickupTime: document.getElementById("pickup_time").value,
      quantity: document.getElementById("quantity").value,

      receiverPreference: document.getElementById("receiver_preference").value,
      address: document.getElementById("location").value.trim(),

      expiryInfo: document.getElementById("expiry_info").value.trim(),
      condition: document.getElementById("condition").value.trim(),
      description: document.getElementById("description").value.trim(),

      status: "pending",
      createdAt: serverTimestamp(),

      // optional but useful
      donorUid: currentUser ? currentUser.uid : null,
      donorEmail: currentUser ? currentUser.email : null
    };

    const coords = window.selectedLocation;
    if (!coords) {
      throw new Error("Please click the map to select pickup coordinates.");
    }
    donationData.location = coords; // { lat, lng }    

    // Save to Firestore
    await addDoc(collection(db, "donations"), donationData);

    // Success UI
    loadingBox.style.display = "none";
    sentBox.style.display = "block";
    form.reset();

  } catch (err) {
    console.error("Donation submit failed:", err);
    loadingBox.style.display = "none";
    errorBox.textContent = "Failed to submit donation. Please try again.";
    errorBox.style.display = "block";
  }
});