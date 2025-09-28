const express = require("express");
const router = express.Router({mergeParams: true});
const Review= require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/expressError.js")

const Listing = require("../models/listing.js");
const {isloggedin , ValidationReview, isreviewAuthor}= require("../middleware.js");
const reviewController = require("../controllers/review.js")


// create review
router.post("/", ValidationReview, isloggedin, wrapAsync(reviewController.createReview));

// delete review
router.delete("/:reviewId", isloggedin, isreviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;