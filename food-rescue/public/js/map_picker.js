window.selectedLocation = null;

let map;
let marker;

window.initMap = () => {
  const defaultCenter = { lat: 3.139, lng: 101.6869 }; // KL
  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultCenter,
    zoom: 12,
  });

  map.addListener("click", (e) => {
    window.selectedLocation = { lat: e.latLng.lat(), lng: e.latLng.lng() };

    if (marker) marker.setMap(null);
    marker = new google.maps.Marker({ position: window.selectedLocation, map });

    const coordsText = document.getElementById("coordsText");
    coordsText.textContent =
      `Selected: ${window.selectedLocation.lat.toFixed(6)}, ${window.selectedLocation.lng.toFixed(6)}`;
  });
};