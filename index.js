const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User= require("./models/user");
const app = express();
const { setCurrentRoute } = require('./middleware');


const dburl = process.env.Atlus_db_url;
const url = https://listing-app-i6au.onrender.com/listing;
const interval = 30000;


// Database connection
async function main() {
    await mongoose.connect(dburl);
}
main()
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

function reloadWebsite() {
  axios
    .get(url)
    .then((response) => {
      console.log("website reloded");
    })
    .catch((error) => {
      console.error(Error : ${error.message});
    });
}

setInterval(reloadWebsite, interval);

// App configuration
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(setCurrentRoute);
const store = mongoStore.create({
    mongoUrl: dburl,
    crypto:{
        secret: process.env.secret
    },
    touchAfter: 24 * 3600 // time period in seconds
});
 store.on("error",()=>{
    console.log("error is mongo session store",err)
 })
const sessionOption = {
    store,
    secret: process.env.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        httpOnly: true
    }
};

app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  res.locals.messages = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.TYPES = [
    "Room", "City", "Mountain", "Beach", "Pool",
    "Castle", "Camping", "Arctic", "Village",
    "Lake", "Apartment"
  ];
  res.locals.currentType = req.query.type || "all";
  next();
});
app.get("/", (req, res) => {
    res.redirect("listing");
});

app.use("/listing", listings);
app.use("/listing/:id/reviews", reviews);
app.use("/", userRouter);

// Error handler
app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error", { message });
});
// app.js or server.js

// Start server
app.listen(8080, () => {
    console.log("Listening on port 8080");
});
