const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const router = express.Router();

const { User } = require("../database/db");

router.post("/signup", async (req, res) => {
  const object = req.body;

  const check = await User.findOne({
    regno: req.body.regno,
  });

  if (check) {
    return res.status(400).json({
      message: "user already exists",
    });
  }
  const userObject = new User(object);
  await userObject.save();
  res.status(200).json({
    message: "user account created successfully",
  });
});

router.post("/login", async (req, res) => {
  //expect: body{regno: String, password: String}

  const regno = req.body.regno;
  const pass = req.body.password;

  const findUser = await User.findOne({
    regno: regno,
    password: pass,
  });

  if (findUser) {
    const object = {
      regno: regno,
    };

    const token = jwt.sign(object, process.env.USER_KEY);
    return res.status(200).json({
      message: "user found",
      token: token,
    });
  }

  res.status(400).json({
    message: "user not found",
  });
});

module.exports = router;
