
const Listing = require("../models/listing.js");

// helper function for geocoding with fetch
async function geocodeLocation(location) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`;
  const res = await fetch(url, {
    headers: { "User-Agent": "ListingApp/1.0" } // required by Nominatim
  });
  const data = await res.json();

  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  }
  return null;
}


module.exports.index = async (req, res) => {
  let { 'search-inp': searchInp, type } = req.query;
  let query = {}; // start empty

  // Only add search filter if searchInp exists
  if (searchInp) {
    query.$or = [
      { title: { $regex: searchInp, $options: 'i' } },
      { description: { $regex: searchInp, $options: 'i' } },
      { location: { $regex: searchInp, $options: 'i' } }
    ];
  }

  // Only add type filter if type exists and not "all"
  if (type && type !== 'all' && TYPES.includes(type)) {
  query.type = type;
}


  // Fetch data from DB **once**
  const data = await Listing.find(query);

  

  res.render("listings/index", { 
    data, 
     
    currentType: type || 'all', 
    searchInp: searchInp || '' 
  });
};


module.exports.newform = (req, res) => {
    res.render("listings/create.ejs");
};


module.exports.create = async (req, res) => {
  const { listing } = req.body;

  // geocode user-entered location
  const coords = await geocodeLocation(listing.location);


  listing.owner = req.user._id;
  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
  }
  if (coords) listing.geometry = coords;

  await Listing.create(listing);

  req.flash("success", "Successfully made a new listing!");
  res.redirect("/listing");
};



module.exports.editform = async (req, res) => {
  let { id } = req.params;
  const data = await Listing.findById(id);

  if (!data) {
    req.flash("error", "Listing not found");
    return res.redirect("/listing");
  }

  // optimize image url (if you use Cloudinary)
  data.image.url = data.image.url.replace(
    "/upload",
    "/upload/w_200,h_200,c_fill,g_auto,r_max/"
  );

  
  res.render("listings/edit.ejs", { data });
};



module.exports.update = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  if (!listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to edit this listing");
    return res.redirect(`/listing/${id}`);
  }

  // re-geocode if location changed
  const coords = await geocodeLocation(req.body.listing.location);

  await Listing.findByIdAndUpdate(id, {
    ...req.body.listing,
    geometry: coords || listing.geometry // keep old if no new coords
  });

  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
    await listing.save();
  }

  req.flash("success", "Successfully updated the listing!");
  res.redirect(`/listing/${id}`);
};




    
module.exports.show = async (req, res) => {
    let { id } = req.params;
    const data = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!data) {
        req.flash("error", "Listing not found");
        return res.redirect("/listing");
    }

    console.log(data);
    res.render("listings/show.ejs", { data });
};

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted a listing!");
    res.redirect("/listing");
};

