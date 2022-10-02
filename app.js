const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Joi = require("joi");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const DB='mongodb+srv://Ankit:<password>@cluster0.jjd1i7u.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect("mongodb://localhost:27017/e-commerce")
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionConfig = {
  secret: "weneedsomebettersecret",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7 * 1,
    maxAge: 1000 * 60 * 60 * 24 * 7 * 1,
  },
};

app.use(session(sessionConfig));
//use to show flash messages
app.use(flash());

// Initialising middleware for passport
app.use(passport.initialize());
app.use(passport.session());

// push or remove the user from the session
// Run when login
passport.serializeUser(User.serializeUser());
// Run when logout
passport.deserializeUser(User.deserializeUser());

//Telling the passport to check for username and password using authenticate method provided by the passport-local-mongoose package
passport.use(new LocalStrategy(User.authenticate()));

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Home Rout
app.get("/", (req, res) => {
  res.render("home");
});

//routs
const productRoutes = require("./routes/productRoutes");
const reviewRouts = require("./routes/review");
const authRouts = require("./routes/auth");
const { date } = require("joi");

app.use(productRoutes);
app.use(reviewRouts);
app.use(authRouts);

const port = 3001;

app.listen(port, () => {
  console.log(`server started at port ${port}`);
});