const mongoose = require("mongoose");
const blogModel = require("../models/blogModel");
const userModel = require("../models/userModel");

// GET ALL BLOGS
exports.getAllBlogsController = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).populate("user");
    if (!blogs || blogs.length === 0) {
      return res.status(200).send({
        success: false,
        message: "No Blogs Found",
      });
    }
    return res.status(200).send({
      success: true,
      BlogCount: blogs.length,
      message: "All Blogs lists",
      blogs,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error While Getting Blogs",
      error,
    });
  }
};

// Create Blog
exports.createBlogController = async (req, res) => {
  try {
    const { title, description, image, user } = req.body;
    // Validation
    if (!title || !description || !image || !user) {
      return res.status(400).send({
        success: false,
        message: "Please Provide All Fields",
      });
    }
    const existingUser = await userModel.findById(user);
    // Validation
    if (!existingUser) {
      return res.status(404).send({
        success: false,
        message: "Unable to find user",
      });
    }

    const newBlog = new blogModel({ title, description, image, user });
    existingUser.blogs.push(newBlog);
    await newBlog.save();
    await existingUser.save();

    return res.status(201).send({
      success: true,
      message: "Blog Created!",
      newBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error While Creating Blog",
      error,
    });
  }
};

// Update Blog
exports.updateBlogController = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;
    const blog = await blogModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true }
    );
    return res.status(200).send({
      success: true,
      message: "Blog Updated!",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error While Updating Blog",
      error,
    });
  }
};

// Single Blog
exports.getBlogByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findById(id);
    if (!blog) {
      return res.status(404).send({
        success: false,
        message: "Blog not found with this ID",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Fetch single blog",
      blog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error while getting single blog",
      error,
    });
  }
};

// Delete Blog
exports.deleteBlogController = async (req, res) => {
  try {
    const blog = await blogModel
      .findByIdAndDelete(req.params.id)
      .populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
    return res.status(200).send({
      success: true,
      message: "Blog Deleted!",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error While Deleting Blog",
      error,
    });
  }
};

// GET USER BLOG
exports.userBlogControlller = async (req, res) => {
  try {
    const userBlog = await userModel.findById(req.params.id).populate("blogs");
    if (!userBlog) {
      return res.status(404).send({
        success: false,
        message: "Blogs not found with this ID",
      });
    }
    return res.status(200).send({
      success: true,
      message: "User blogs",
      userBlog,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      success: false,
      message: "Error in user blog",
      error,
    });
  }
};
