const express = require('express');
const router = express.Router();
const User = require("../models/User");
const bcrypt = require('bcrypt');
const saltRounds = 10;

//register
router.post("/register", async(req,res) => {
    try {

        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(req.body.password, salt);
        
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hash

        });

        const user = await newUser.save();
        res.status(200).json(user);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
})

module.exports = router;