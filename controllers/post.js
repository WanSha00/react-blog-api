const Post = require("../models/Post");
const cloudinary = require("../middleware/cloudinary");

module.exports = {
  createPost: async (req, res) => {
    try {
      const newPost = new Post({
        title: req.body.title,
        photo: req.body.photo,
        cloudinaryId: req.body.cloudinaryId,
        desc: req.body.desc,
        user: req.body.user,
        categories: req.body.categories,
      });
      const savedPost = await newPost.save();
      res.status(200).json(savedPost);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getPostById: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.status(200).json(post);
    } catch (error) {
      res.status(404).json("Post not found.");
    }
  },

  updatePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if(req.body.cloudinaryId!==post.cloudinaryId){
        await cloudinary.uploader.destroy("blog/" + post.cloudinaryId);
      }
      
      const updatedPost = await Post.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res.status(200).json(updatedPost);
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      await cloudinary.uploader.destroy("blog/" + post.cloudinaryId);
      await post.deleteOne();
      res.status(200).json("Post deleted.");
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getPostsByQuery: async (req, res) => {
    const user = req.query.user;
    const category = req.query.category;

    try {
      let posts;

      if (user && category) {
        posts = await Post.find({
          user,
          categories: {
            $in: [category],
          },
        })
          .sort({ createdAt: "desc" })
          .lean();
      } else if (user) {
        posts = await Post.find({ user }).sort({ createdAt: "desc" }).lean();
      } else if (category) {
        posts = await Post.find({
          categories: {
            $in: [category],
          },
        })
          .sort({ createdAt: "desc" })
          .lean();
      } else {
        posts = await Post.find().sort({ createdAt: "desc" }).lean();
      }

      res.status(200).json(posts);
    } catch (error) {
      res.status(404).json("Posts not found.");
    }
  },
};
