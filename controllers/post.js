const Post = require("../models/Post");

module.exports = {
  createPost: async (req, res) => {
    const newPost = new Post(req.body);
    try {
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
      try {
        if (post.username === req.body.username) {
          try {
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
        } else {
          res.status(401).json("You can only update your own post.");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  deletePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      try {
        if (post.username === req.body.username) {
          try {
            await post.deleteOne();

            res.status(200).json("Post deleted.");
          } catch (error) {
            console.log(error);
            res.status(500).json(error);
          }
        } else {
          res.status(401).json("You can only delete your own post.");
        }
      } catch (error) {
        res.status(500).json(error);
      }
    } catch (error) {
      res.status(500).json(error);
    }
  },

  getPostsByQuery: async (req, res) => {
    const username = req.query.user;
    const category = req.query.category;

    try {
      let posts;

      if (username && category) {
        posts = await Post.find({
          username,
          categories: {
            $in: [category],
          },
        });
      } else if (username) {
        posts = await Post.find({ username });
      } else if (category) {
        posts = await Post.find({
          categories: {
            $in: [category],
          },
        });
      } else {
        posts = await Post.find();
      }

      res.status(200).json(posts);
    } catch (error) {
      res.status(404).json("Posts not found.");
    }
  },
};