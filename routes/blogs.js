const express = require("express");
const router = express.Router();

const Blog = require("../models/blog");
const middleware = require("../middleware");

// show all items
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({created: -1});
    res.render("blogs/index", {blogs});
  } catch (err) {
    throw `Cannot get data from db, ${err}`
  }
});

// create new item
router.post("/", middleware.isLoggedIn, async (req, res) => {
  try {
    req.body.post.description = req.sanitize(req.body.post.description);
    let newBlog = req.body.post;
    newBlog.author = {
      id: req.user._id,
      username: req.user.username
    };
    const blog = await Blog.create(newBlog);
    res.redirect(`blogs/${blog._id}`);

  } catch (err) {
    throw `Could not create document, ${err}`;
  }
});

// show form to create new item
router.get("/new", middleware.isLoggedIn, (req, res) => {
  res.render('blogs/new');
});

// show a single item
router.get("/:id", async (req, res) => {
  try {
    if (req.params.id.length < 24 ){
      return res.render("404");
    }
    const blog = await Blog.findById(req.params.id).populate("comments").exec();
    res.render("blogs/show", {blog});
  } catch (err) {
    throw `Could not find document, ${err}`;
  }
});

// EDIT ROUTE
router.get("/:id/edit", middleware.checkBlogOwnership, async (req, res) => {
  try {
      const blog = await Blog.findById(req.params.id);
      res.render("blogs/edit", {blog});
  } catch (e) {
    console.log(e);
    res.redirect(`back`);
  }
});

// UPDATE blog
router.put("/:id", middleware.checkBlogOwnership, async (req, res) => {
  try {
    req.body.post.description = req.sanitize(req.body.post.description);
    await Blog.findByIdAndUpdate(req.params.id, req.body.post);
    res.redirect(`/blogs/${req.params.id}`);
  } catch (e) {
    console.log(e);
    res.redirect("/blogs");
  }
});

// DESTROY blog ROUTE
router.delete("/:id", middleware.checkBlogOwnership, async (req, res) => {
  try {
    await Blog.findByIdAndRemove(req.params.id);
    res.redirect("/blogs");
  } catch (e) {
    console.log(e);
    res.redirect("/blogs");
  }
});

module.exports = router;