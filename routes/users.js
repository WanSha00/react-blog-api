const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

//get user by id
router.get("/:id", userController.getUserById);

//update user
router.put("/:id", userController.updateUser);

//delete user
router.delete("/:id", userController.deleteUser);

module.exports = router;
