const express = require("express");
const mongoose = require("mongoose");
const todoSchema = require("../schemas/todoSchema");

const router = express.Router();

// make todo modal, this mainly return a class
const Todo = new mongoose.model("Todo", todoSchema);

// GET ALL TODOs
router.get("/", async (req, res) => {
  res.send("ok");
});

// POST A TODOs
router.post("/", async (req, res) => {
  // const newToDO = new Todo(req.body);
  const newToDO = new Todo(req.body);
  await newToDO.save((err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error",
      });
    } else {
      res.status(200).json({
        message: "TODO inserted successfully !!!",
      });
    }
  });
});

// POST MULTIPLE TODOs
router.post("/all", async (req, res) => {
  await Todo.insertMany(req.body, (err) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error",
      });
    } else {
      res.status(200).json({
        message: "TODOs are inserted successfully !!!",
      });
    }
  });
});

module.exports = router;
