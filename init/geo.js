const mongoose = require("mongoose");
const Listing = require("../models/listing");

// helper
async function geocodeLocation(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  const res = await fetch(url, { headers: { "User-Agent": "ListingApp/1.0" } });
  const data = await res.json();
  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  }
  return null;
}

async function fixListings() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yourDB");

  const listings = await Listing.find({});
  for (let listing of listings) {
    if (!listing.geometry || !listing.geometry.lat) {
      const coords = await geocodeLocation(listing.location);
      if (coords) {
        listing.geometry = coords;
        await listing.save();
        console.log(`✅ Updated: ${listing.title} (${listing.location})`);
      } else {
        console.log(`⚠️ Could not geocode: ${listing.title}`);
      }
    }
  }

  mongoose.connection.close();
}

fixListings();
