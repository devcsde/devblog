"use strict";

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require("express");
var router = express.Router({ mergeParams: true });
var Blog = require("../models/blog");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// COMMENTS ROUTES
// show the add comment form
router.get("/new", middleware.isLoggedIn, function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
    var blog;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return Blog.findById(req.params.id);

          case 3:
            blog = _context.sent;

            res.render("comments/new", { blog: blog });
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](0);
            throw _context.t0;

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

// add the new comment
router.post("/", middleware.isLoggedIn, function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
    var blog, comment;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;

            req.body.comment.text = req.sanitize(req.body.comment.text);
            _context2.next = 4;
            return Blog.findById(req.params.id);

          case 4:
            blog = _context2.sent;
            _context2.next = 7;
            return Comment.create(req.body.comment);

          case 7:
            comment = _context2.sent;

            // add username and id to comment
            comment.author.id = req.user._id;
            comment.author.username = req.user.username;
            // save comment
            comment.save();
            _context2.next = 13;
            return blog.comments.push(comment);

          case 13:
            blog.save();
            res.redirect("/blogs/" + blog._id);

            _context2.next = 21;
            break;

          case 17:
            _context2.prev = 17;
            _context2.t0 = _context2["catch"](0);

            console.log("There was an error, " + _context2.t0);
            res.redirect("/blogs");

          case 21:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[0, 17]]);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

// SHOW UPDATE / EDIT COMMENT ROUTE
router.get("/:cid/edit", middleware.checkCommentOwnership, function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
    var comment, blogId;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return Comment.findById(req.params.cid);

          case 3:
            comment = _context3.sent;
            blogId = req.params.id;

            res.render("comments/edit", { comment: comment, blogId: blogId });
            _context3.next = 12;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);

            res.redirect("/blogs/" + req.params.id);
            throw _context3.t0;

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 8]]);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}());

// UPDATE / EDIT COMMENT
router.put("/:cid", middleware.checkCommentOwnership, function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;

            req.body.comment.text = req.sanitize(req.body.comment.text);
            _context4.next = 4;
            return Comment.findByIdAndUpdate(req.params.cid, req.body.comment);

          case 4:
            res.redirect("/blogs/" + req.params.id);
            _context4.next = 10;
            break;

          case 7:
            _context4.prev = 7;
            _context4.t0 = _context4["catch"](0);
            throw _context4.t0;

          case 10:
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

// DESTROY COMMENT
router.delete("/:cid", middleware.checkCommentOwnership, function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            _context5.next = 3;
            return Comment.findByIdAndRemove(req.params.cid);

          case 3:
            res.redirect("/blogs/" + req.params.id);
            _context5.next = 10;
            break;

          case 6:
            _context5.prev = 6;
            _context5.t0 = _context5["catch"](0);

            console.log(_context5.t0);
            res.redirect("/blogs/" + req.params.id);

          case 10:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, undefined, [[0, 6]]);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}());

module.exports = router;
//# sourceMappingURL=comments.js.map