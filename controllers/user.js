const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (error) {
      res.status(404).json("User not found.");
    }
  },

  updateUser: async (req, res) => {
    const user = await User.findById(req.params.id);
    if (req.body.cloudinaryId !== user.cloudinaryId) {
      await cloudinary.uploader.destroy("blog/" + user.cloudinaryId);
    }

    if(req.body.password!==""){
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
    }else{
      req.body.password = user.password;
    }    

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.params.id });
      posts.map((post) => {
        cloudinary.uploader.destroy("blog/" + post.cloudinaryId);
      });

      const user = await User.findById(req.params.id);
      await cloudinary.uploader.destroy("blog/" + user.cloudinaryId);
      await Post.deleteMany({ user: req.params.id });
      await User.findByIdAndDelete(req.params.id);

      res.status(200).json("User has been deleted.");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
