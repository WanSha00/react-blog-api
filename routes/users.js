const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Post = require("../models/Post");

const bcrypt = require("bcrypt");
const saltRounds = 10;

//update
router.put("/:id", async (req, res) => {
  if (req.body.userID === req.params.id) {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(req.body.password, salt);
      req.body.password = hash;
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
  } else {
    res.status(401).json("You can only update your account.");
  }
});

//delete
router.delete("/:id", async (req, res) => {
  if (req.body.userID === req.params.id) {
    try {

      const user = await User.findById(req.params.id);
      try {
        const userPost = await Post.find({username:user.username});
        await Post.deleteMany({username : user.username});
        await User.findByIdAndDelete(req.params.id);

        res.status(200).json("User has been deleted.");

      } catch (error) {
        console.log("delete error  >>  " + error);
        res.status(500).json(error);
      }
    } catch (error) {
      console.log("no user error  >>  " + error)
      res.status(404).json("User not found.");
    }
  } else {
    res.status(401).json("You can only delete your account.");
  }
});
module.exports = router;
