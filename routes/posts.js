const express = require("express");
const router = express.Router();
const postController = require("../controllers/post");

//create post
router.post("/", postController.createPost);

//get a post by id
router.get("/:id", postController.getPostById);

//update post
router.put("/:id", postController.updatePost);

//delete post
router.delete("/:id", postController.deletePost);

//get posts by query
router.get("/", postController.getPostsByQuery);

module.exports = router;
