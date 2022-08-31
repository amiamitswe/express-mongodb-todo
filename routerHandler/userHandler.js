// dependencies
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../schemas/userSchema");
const {
  sighUpMiddleware,
  loginMiddleware,
} = require("../middleware/userMiddleware");

const router = express.Router();

// make a user modal, this mainly return a class
const UserModel = new mongoose.model("User", userSchema);

// SIGNUP user
router.post("/signup", sighUpMiddleware, async (req, res) => {
  const newUser = new UserModel(req.signupData);
  try {
    const findIfUserExist = await UserModel.find({
      username: req.signupData.username,
    });
    if (findIfUserExist && findIfUserExist.length > 0) {
      res.status(200).json({
        error: "User already exist",
      });
    } else {
      try {
        const result = await newUser.save();
        const finalResultToUser = await {
          _id: result._id,
          name: result.name,
          username: result.username,
          status: result.status,
        };
        res.status(200).json({
          message: "User created successfully",
          data: finalResultToUser,
        });
      } catch (err) {
        res.status(500).json({
          error: "There was a server side error",
          err,
        });
      }
    }
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      err,
    });
  }
});

// LOGIN user
router.post("/login", loginMiddleware, async (req, res) => {
  try {
    const user = await UserModel.find({
      username: req.body.username.toLowerCase(),
    });
    if (user && user.length === 1) {
      const userData = user[0];
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        userData.password
      );
      if (isValidPassword) {
        const token = jwt.sign(
          {
            username: userData.username,
            userId: userData._id,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login Success!!", token });
      } else {
        res.status(401).json({ error: "Authentication Failed" });
      }
    } else {
      res.status(401).json({ error: "Authentication Failed" });
    }
  } catch {
    res.status(401).json({ error: "Authentication Failed" });
  }
});

router.get("/", (req, res) => {
  res.send("ok");
});

module.exports = router;
