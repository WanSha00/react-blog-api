const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

//create post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json(error);
  }
});

//update post
router.put("/:id", async (req, res) => {
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
});

//delete post
router.delete("/:id", async (req, res) => {
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
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json("Post not found.");
  }
});

//get all posts
// router.get("/", async (req, res) => {
//   try {
//     const posts = await Post.find();
//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(404).json("Posts not found.");
//   }
// });

//get all posts
router.get("/", async (req, res) => {
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
});

module.exports = router;
