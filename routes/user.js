const express = require("express");
const router = express.Router();
const User =require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveReturnTo } = require("../middleware")
const userController = require("../controllers/user.js")


// signup
router.get("/signup", userController.renderSignup);
router.post("/signup", wrapAsync(userController.signup));

// login
router.get("/login", userController.renderLogin);
router.post(
    "/login",
    saveReturnTo,
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    userController.login
);

// logout
router.get("/logout", userController.logout);

module.exports = router;