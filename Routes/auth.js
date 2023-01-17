const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../Models/User");
const router = express.Router();

//Createing a User using: POST "/api/auth/createuser". Doesn't require auth
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
      let User = await User.findOne({ email: req.body.email });
      if (User) {
        return res
          .status(400)
          .json({ error: "sorry a user with this request already exists" });
      } else {
        //Create a new User
        User = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
        });
      }
      res.send(User);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: "some error accured" });
    }
  }
);
module.exports = router;
