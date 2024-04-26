const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

module.exports = {
  registerNewUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(req.body.password, salt);

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });

      const user = await newUser.save();

      //show all details except password
      const { password, ...others } = user._doc;

      res.status(200).json(others);

    } catch (error) {
      res.status(500).json(error);
    }
  },

  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({
        email: req.body.email,
      });

      if (!user) {
        return res.status(400).json("Wrong credentials!");
      }

      const validated = await bcrypt.compare(req.body.password, user.password);

      if (!validated) {
        return res.status(400).json("Wrong credentials!");
      }

      //show all details except password
      const { password, ...others } = user._doc;

      res.status(200).json(others);
      
    } catch (error) {
      res.status(500).json(error);
    }
  },
};
