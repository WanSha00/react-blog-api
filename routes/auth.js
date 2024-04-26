const express = require("express");
const router = express.Router();
const authContoller = require("../controllers/auth");

//register new user
router.post("/register", authContoller.registerNewUser);

//login user
router.post("/login", authContoller.loginUser);

module.exports = router;
