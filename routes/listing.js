 if (process.env.NODE_ENV !== "production") {require("dotenv").config();}

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const ExpressError = require("../utils/expressError.js")
const Listing = require("../models/listing.js");

const {isloggedin , isAuthor , Validationlisting}= require("../middleware.js")
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");

const upload = multer({ storage: storage });



// index
router.get("/", wrapAsync(listingController.index));


// create form
router.get("/create", isloggedin, listingController.newform);

//create route
router.post(
  "/new",
  isloggedin,
  upload.single("listing[image]"),
  Validationlisting,   
  wrapAsync(listingController.create)
);



// update form
router.get("/:id/edit", isloggedin, isAuthor, wrapAsync(listingController.editform));

// update route
router.route("/:id")
    .put(
        isloggedin,
        isAuthor,
        upload.single("listing[image]"),
        Validationlisting,
    wrapAsync(listingController.update)
)
.get(
     wrapAsync(listingController.show))
.delete(
     isloggedin, isAuthor, wrapAsync(listingController.delete));


module.exports = router;
