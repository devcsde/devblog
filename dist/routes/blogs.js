"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require("express");
var router = express.Router();

var Blog = require("../models/blog");
var middleware = require("../middleware");

// show all items
router.get("/", function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var blogs;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return Blog.find({}).sort({ created: -1 });

          case 3:
            blogs = _context.sent;

            res.render("blogs/index", { blogs: blogs });
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            throw "Cannot get data from db, " + _context.t0;

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 7]]);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

// create new item
router.post("/", middleware.isLoggedIn, function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var newBlog, blog;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            req.body.post.description = req.sanitize(req.body.post.description);
            newBlog = req.body.post;

            newBlog.author = {
              id: req.user._id,
              username: req.user.username
            };
            _context2.next = 6;
            return Blog.create(newBlog);

          case 6:
            blog = _context2.sent;

            res.redirect("blogs/" + blog._id);

            _context2.next = 13;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](0);
            throw "Could not create document, " + _context2.t0;

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 10]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

// show form to create new item
router.get("/new", middleware.isLoggedIn, function (req, res) {
  res.render('blogs/new');
});

// show a single item
router.get("/:id", function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var blog;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;

            if (!(req.params.id.length < 24)) {
              _context3.next = 3;
              break;
            }

            return _context3.abrupt("return", res.render("404"));

          case 3:
            _context3.next = 5;
            return Blog.findById(req.params.id).populate("comments").exec();

          case 5:
            blog = _context3.sent;

            res.render("blogs/show", { blog: blog });
            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](0);
            throw "Could not find document, " + _context3.t0;

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 9]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

// EDIT ROUTE
router.get("/:id/edit", middleware.checkBlogOwnership, function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    var blog;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return Blog.findById(req.params.id);

          case 3:
            blog = _context4.sent;

            res.render("blogs/edit", { blog: blog });
            _context4.next = 11;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);

            console.log(_context4.t0);
            res.redirect("back");

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, undefined, [[0, 7]]);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}());

// UPDATE blog
router.put("/:id", middleware.checkBlogOwnership, function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;

            req.body.post.description = req.sanitize(req.body.post.description);
            _context5.next = 4;
            return Blog.findByIdAndUpdate(req.params.id, req.body.post);

          case 4:
            res.redirect("/blogs/" + req.params.id);
            _context5.next = 11;
            break;

          case 7:
            _context5.prev = 7;
            _context5.t0 = _context5["catch"](0);

            console.log(_context5.t0);
            res.redirect("/blogs");

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[0, 7]]);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());

// DESTROY blog ROUTE
router.delete("/:id", middleware.checkBlogOwnership, function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(req, res) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _context6.next = 3;
            return Blog.findByIdAndRemove(req.params.id);

          case 3:
            res.redirect("/blogs");
            _context6.next = 10;
            break;

          case 6:
            _context6.prev = 6;
            _context6.t0 = _context6["catch"](0);

            console.log(_context6.t0);
            res.redirect("/blogs");

          case 10:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, undefined, [[0, 6]]);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}());

module.exports = router;
//# sourceMappingURL=blogs.js.map