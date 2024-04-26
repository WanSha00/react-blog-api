const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category");

//create category
router.post("/", categoryController.createCategory);

//get category
router.get("/", categoryController.getCategory);

module.exports = router;