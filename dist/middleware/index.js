"use strict";

var Blog = require("../models/blog");
var Comment = require("../models/comment");

// all middleware

var middlewareObj = {};

middlewareObj.checkBlogOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Blog.findById(req.params.id, function (err, blog) {
      if (err) {
        res.redirect("back");
      } else {
        // mongoose method .equals can compare the string with object_id from DB
        if (req.user && (blog.author.id.equals(req.user._id) || req.user.admin)) {
          next();
        } else {
          console.log("You are not the owner of this content");
          res.redirect("back");
        }
      }
    });
  } else {
    console.log("You need to be logged in to do it");
    res.redirect("back");
  }
};

middlewareObj.checkCommentOwnership = function (req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.cid, function (err, comment) {
      if (err) {
        res.redirect("back");
      } else {
        // mongoose method .equals can compare the req.params string  with object_id from DB
        if (req.user && (comment.author.id.equals(req.user._id) || req.user.admin)) {
          next();
        } else {
          console.log("You are not the owner of this content");
          res.redirect("back");
        }
      }
    });
  } else {
    console.log("You need to be logged in to do it");
    res.redirect("back");
  }
};

middlewareObj.isLoggedIn = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

middlewareObj.isAdmin = function (req, res, next) {
  if (req.user.admin === true) {
    return next();
  }
  res.redirect("/blogs");
};

module.exports = middlewareObj;
//# sourceMappingURL=index.js.map