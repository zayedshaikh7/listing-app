let map = L.map("map").setView([listingLat, listingLng], 12);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

L.marker([listingLat, listingLng])
  .addTo(map)
  .bindPopup("<b>" + listingTitle + "</b><br>" + listingLocation)
  // .openPopup();
