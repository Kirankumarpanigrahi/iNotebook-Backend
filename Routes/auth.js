const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../Models/User");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const jwt_secret = "kiranisagoodboy";
//Route 1 :Createing a User using: POST "/api/auth/createuser". Doesn't require auth
router.post(
  "/createuser",
  [
    body("name", "Enter a valid Name").isLength({ min: 3 }),
    body("email", "Enter a valid Email").isEmail(),
    body("password", "password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //It will show any error if occuered
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //checkes if the user with same email exist or not
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry a user with this request already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      //Create a new User
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, jwt_secret);
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "some error accured" });
    }
  }
);

//Route 2 :Logging in using User Details: POST "/api/auth/login". No Login require
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    //It will show any error if occuered
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    //checkes if the user with same email exist or not
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Invalid credentials please try with right ones" });
      }
      let passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        return res
          .status(400)
          .json({ error: "Invalid credentials please try with right ones" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, jwt_secret);
      res.json({ authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "Internal Server error" });
    }
  }
);
//Route 3 :Getting user details using authtoken: POST "/api/auth/getuser". Login require
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userid = req.user.id;
    const user = await User.findById(userid).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Internal Server error" });
  }
});
module.exports = router;
