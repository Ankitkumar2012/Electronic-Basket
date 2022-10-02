const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const { session } = require("passport");

// router.get("/fakeuser", async (req, res) => {
//   const user = {
//     email: "sohil@gmail.com",
//     username: "sohil",
//   };
//   const newUser = await User.register(user, "sohil12");
//   //    console.log(newUser);
//   res.send(newUser);
// });

router.get("/register", (req, res) => {
  res.render("auth/signup");
});

router.post("/register", async (req, res) => {
  // console.log(req.body);
  try {
    const { username, password, email, role } = req.body;
    const user = new User({ username, email, role });
    const newUser = await User.register(user, password);

    req.login(newUser, function (err) {
      if (err) {
        return next(err);
      }

      req.flash("success", `Welcome Back ${req.user.username} again`);

      return res.redirect("/products");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    //   console.log(req.user);

    req.flash("success", `Welcome Back  ${req.user.username} Again!!`);
    console.log(req.session);
    // let redirectUrl = req.session.returnUrl;
    // if(redirectUrl && redirectUrl.indexOf('review')!==-1){

    // }

    // delete req.session.returnUrl;

    // res.redirect(redirectUrl);
    res.redirect("/products");
  }
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      req.flash("error", "cannot logout at the momemt");
      return res.redirect("/products");
    }
    req.flash("success", "Good Bye!");
    res.redirect("/login");
  });
});

module.exports = router;