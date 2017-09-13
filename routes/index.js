const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

// ROOT ROUTE
router.get("/", (req, res) => {
  res.render("landing", {currentUser: req.user});
});

//  AUTH ROUTES
// show the register form
router.get("/register", (req, res) => {
  res.render("register");
});

// handle signup logic
router.post("/register", async (req, res) => {
  try {
    const newUser = new User({username: req.body.username, email: req.body.email});
    // check if email already exists
    const emailExists = await User.find({email: req.body.email});
    if (emailExists.length > 0) {
      throw `${req.body.email} is already in the database.`;
    }
    // authenticate as admin, when registering with email from .env file
    newUser.admin = req.body.email === process.env.DB_ADMIN;

    await User.register(newUser, req.body.password, (err, user) => {
      if (err) {
        throw err;
      }
      passport.authenticate("local")(req,res, () => {
        res.redirect("/blogs");
      });
    });
  } catch (err) {
    console.log(err);
    return res.render("register");
  }

});

// render login form
router.get("/login", (req, res)=> {
  res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local",{
  successRedirect: "/blogs",
  failureRedirect: "/login"
}));

// logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/blogs");
});

module.exports = router;