import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const list = document.getElementById("donationList");

const snapshot = await getDocs(collection(db, "donations"));

snapshot.forEach(doc => {
  const li = document.createElement("li");
  li.textContent = doc.data().description + " - " + doc.data().status;
  list.appendChild(li);
});
