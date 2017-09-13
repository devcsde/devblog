const Blog = require("../models/blog");
const Comment = require("../models/comment");

// all middleware

let middlewareObj = {};

middlewareObj.checkBlogOwnership = (req, res, next) => {
  if (req.isAuthenticated()){
    Blog.findById(req.params.id, (err, blog) => {
      if (err){
        res.redirect("back");
      } else {
        // mongoose method .equals can compare the string with object_id from DB
        if (req.user && (blog.author.id.equals(req.user._id) || req.user.admin)){
          next();
        } else {
          console.log("You are not the owner of this content");
          res.redirect(`back`);
        }
      }
    });
  } else {
    console.log("You need to be logged in to do it");
    res.redirect(`back`);
  }
};

middlewareObj.checkCommentOwnership = (req, res, next) => {
  if (req.isAuthenticated()){
    Comment.findById(req.params.cid, (err, comment) => {
      if (err){
        res.redirect("back");
      } else {
        // mongoose method .equals can compare the req.params string  with object_id from DB
        if (req.user && (comment.author.id.equals(req.user._id) || req.user.admin)){
          next();
        } else {
          console.log("You are not the owner of this content");
          res.redirect(`back`);
        }
      }
    });
  } else {
    console.log("You need to be logged in to do it");
    res.redirect(`back`);
  }
};

middlewareObj.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

middlewareObj.isAdmin = (req, res, next) => {
  if (req.user.admin === true) {
    return next();
  }
  res.redirect("/blogs");
};

module.exports = middlewareObj;