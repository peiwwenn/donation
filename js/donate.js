import { collection, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.submitDonation = async () => {
  const desc = document.getElementById("desc").value;
  const qty = document.getElementById("quantity").value;
  const loc = document.getElementById("location").value;

  await addDoc(collection(db, "donations"), {
    description: desc,
    quantity: qty,
    location: loc,
    status: "pending",
    createdAt: serverTimestamp()
  });

  alert("Donation submitted!");
};