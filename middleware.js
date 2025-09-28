const Listing = require("./models/listing.js");
const ExpressError = require("./utils/expressError.js")
const Review= require("./models/review.js");
const {listingSchema ,reviewSchema}= require("./schema.js");

module.exports.isloggedin = (req, res, next) => {

    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
};
module.exports.saveReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
        req.flash("error", "You do not have permission to edit this listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
};
module.exports.Validationlisting = (req,res,next)=>{
    const { error } = listingSchema.validate(req.body);

    if (error) {
        throw new ExpressError(400, error.details[0].message);
    }else{
        next();
    }
 }
 module.exports.ValidationReview = (req,res,next)=>{

     const {error} = reviewSchema.validate(req.body);
 
     if (error) {
         throw new ExpressError(400, error.details[0].message);
     }else{
         next();
     }
  }
 module.exports.isreviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findById(id);
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You do not have permission to edit this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
};
// middleware.js
module.exports.setCurrentRoute = (req, res, next) => {
  res.locals.currentRoute = req.originalUrl;  // available in all EJS files
  next();
};
