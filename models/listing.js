 
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const defaultImage = "https://images.pexels.com/photos/13138213/pexels-photo-13138213.jpeg?_gl=1*xjezs7*_ga*MTY2MDY2NzM0LjE3NTEyODI0OTE.*_ga_8JE65Q40S6*czE3NTEyODI0OTEkbzEkZzEkdDE3NTEyODI1NDYkajUkbDAkaDA.";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    image: {
        url : String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    geometry: {
    lat: Number,
    lng: Number
  },
  type: {
    type: String,
    enum: ['Room', 'City', 'Mountain', 'Beach', 'Pool', 'Castle', 'Camping', 'Arctic', 'Village', 'Lake', 'Apartment'],
    default: 'apartment'
  },
  reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
  }],
  owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});


listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){ 
        await Review.deleteMany({ _id : { $in: listing.reviews } });
}
})



const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
