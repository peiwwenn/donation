import { collection, addDoc, serverTimestamp } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let selectedLocation = null;
let map;
let marker;

// Called by Google Maps
window.initMap = () => {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 3.139, lng: 101.6869 }, // KL default
    zoom: 12
  });

  map.addListener("click", (e) => {
    selectedLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    };

    if (marker) marker.setMap(null);

    marker = new google.maps.Marker({
      position: selectedLocation,
      map: map
    });
  });
};

window.submitDonation = async () => {
  const desc = document.getElementById("desc").value;
  const qty = document.getElementById("quantity").value;

  if (!selectedLocation) {
    alert("Please select a pickup location on the map");
    return;
  }

  await addDoc(collection(db, "donations"), {
    description: desc,
    quantity: qty,
    location: selectedLocation, // ✅ lat/lng object
    status: "pending",
    createdAt: serverTimestamp()
  });

  alert("Donation submitted!");
};