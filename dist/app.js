"use strict";

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    session = require("express-session"),
    MongoStore = require("connect-mongo")(session),
    User = require("./models/user"),
    IP = process.env.IP || "localhost",
    port = process.env.PORT || 3000;

require('dotenv').config();

var commentRoutes = require("./routes/comments");
var blogRoutes = require("./routes/blogs");
var indexRoutes = require("./routes/index");

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_DEV_URI, { useMongoClient: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

// PASSPORT CONFIGURATION
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 // Timeout 180 mins
  } }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this middleware provides in every route req.user
// AND in every view currentUser
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.use(indexRoutes);
app.use("/blogs/:id/comments", commentRoutes);
app.use("/blogs", blogRoutes);

// Handle 404 - Keep this as a last route
app.use(function (req, res, next) {
  res.status(400);
  res.render("404");
  //res.send('404: File Not Found');
});

app.listen(port, IP, function () {
  console.log("Server started at port " + IP + ":" + port);
});
//# sourceMappingURL=app.js.map