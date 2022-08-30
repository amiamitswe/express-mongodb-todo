// dependencies
const express = require("express");
const mongoose = require("mongoose");
const { sighUpMiddleware } = require("../middleware/userMiddleware");
const userSchema = require("../schemas/userSchema");

const router = express.Router();

// make a user modal, this mainly return a class
const UserModel = new mongoose.model("User", userSchema);

// SIGNUP user
router.post("/signup", sighUpMiddleware, async (req, res) => {
  const newUser = new UserModel(req.signupData);

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
});

router.get("/", (req, res) => {
  res.send("ok");
});

module.exports = router;
