const express = require("express");
const router = express.Router({mergeParams: true});
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const middleware = require("../middleware");


// COMMENTS ROUTES
// show the add comment form
router.get("/new", middleware.isLoggedIn, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.render("comments/new", {blog});
  } catch (e) {
    throw e;
  }
});

// add the new comment
router.post("/", middleware.isLoggedIn, async (req, res) => {
  try {
    req.body.comment.text = req.sanitize(req.body.comment.text);
    const blog = await Blog.findById(req.params.id);
    const comment = await Comment.create(req.body.comment);
    // add username and id to comment
    comment.author.id = req.user._id;
    comment.author.username = req.user.username;
    // save comment
    comment.save();
    await blog.comments.push(comment);
    blog.save();
    res.redirect(`/blogs/${blog._id}`);

  } catch (e) {
    console.log(`There was an error, ${e}`);
    res.redirect("/blogs");
  }
});

// SHOW UPDATE / EDIT COMMENT ROUTE
router.get("/:cid/edit", middleware.checkCommentOwnership, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.cid);
    const blogId = req.params.id;
    res.render("comments/edit", {comment, blogId})
  } catch (e) {
    res.redirect(`/blogs/${req.params.id}`);
    throw e;
  }
});

// UPDATE / EDIT COMMENT
router.put("/:cid", middleware.checkCommentOwnership, async (req, res) => {
  try {
    req.body.comment.text = req.sanitize(req.body.comment.text);
    await Comment.findByIdAndUpdate(req.params.cid, req.body.comment);
    res.redirect(`/blogs/${req.params.id}`);
  } catch (e) {
    throw e;
  }
});

// DESTROY COMMENT
router.delete("/:cid", middleware.checkCommentOwnership, async (req, res) => {
  try {
    await Comment.findByIdAndRemove(req.params.cid);
    res.redirect(`/blogs/${req.params.id}`);
  } catch (e) {
    console.log(e);
    res.redirect(`/blogs/${req.params.id}`);
  }
});

module.exports = router;