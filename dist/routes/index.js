"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ROOT ROUTE
router.get("/", function (req, res) {
  res.render("landing", { currentUser: req.user });
});

//  AUTH ROUTES
// show the register form
router.get("/register", function (req, res) {
  res.render("register");
});

// handle signup logic
router.post("/register", function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var newUser, emailExists;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            newUser = new User({ username: req.body.username, email: req.body.email });
            // check if email already exists

            _context.next = 4;
            return User.find({ email: req.body.email });

          case 4:
            emailExists = _context.sent;

            if (!(emailExists.length > 0)) {
              _context.next = 7;
              break;
            }

            throw req.body.email + " is already in the database.";

          case 7:
            // authenticate as admin, when registering with email from .env file
            newUser.admin = req.body.email === process.env.DB_ADMIN;

            _context.next = 10;
            return User.register(newUser, req.body.password, function (err, user) {
              if (err) {
                throw err;
              }
              passport.authenticate("local")(req, res, function () {
                res.redirect("/blogs");
              });
            });

          case 10:
            _context.next = 16;
            break;

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);

            console.log(_context.t0);
            return _context.abrupt("return", res.render("register"));

          case 16:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 12]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// render login form
router.get("/login", function (req, res) {
  res.render("login");
});

// handle login logic
router.post("/login", passport.authenticate("local", {
  successRedirect: "/blogs",
  failureRedirect: "/login"
}));

// logout route
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/blogs");
});

module.exports = router;
//# sourceMappingURL=index.js.map