const User = require("../models/user.js");
const passport = require("passport");

module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res, next) => {
    const { username, password, email } = req.body;
    try {
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);

        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to the site!");
            return res.redirect("/listing");
        });
    } catch (e) {
        req.flash("error", e.message);
        return res.redirect("/signup");
    }
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.login = (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.returnTo || "/listing");
};

module.exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You logged out successfully");
        res.redirect("/listing");
    });
};
