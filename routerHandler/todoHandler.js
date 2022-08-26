const express = require("express");
const mongoose = require("mongoose");
const todoSchema = require("../schemas/todoSchema");

const router = express.Router();

// make todo modal, this mainly return a class
const Todo = new mongoose.model("Todo", todoSchema);

// GET ALL TODOs
router.get("/", async (req, res) => {
  // await Todo.find({ status: "inactive" }, "status date", { limit: 10, skip: 1 })
  //   .then((data) => {
  //     res.status(200).json({
  //       message: "Fetching data success",
  //       totalDataCount: data.length,
  //       data,
  //     });
  //   })
  //   .catch((err) => {
  //     res.status(500).json({
  //       error: "There was a server side error",
  //       err,
  //     });
  //   });
  // ########################################################################
  // await Todo.find({ status: "inactive" })
  //   .select({
  //     _id: 0,
  //     date: 0,
  //   })
  //   .limit(2)
  //   .exec((err, data) => {
  //     if (err) {
  //       res.status(500).json({
  //         error: "There was a server side error",
  //         err,
  //       });
  //     } else {
  //       res.status(200).json({
  //         message: "Fetching data success",
  //         totalDataCount: data.length,
  //         data,
  //       });
  //     }
  //   });
  // ########################################################################
  await Todo.find({ status: "inactive" })
    .select({
      _id: 0,
      date: 0,
      title: 0,
      __v: 0,
    })
    .limit(20)
    .then((data) => {
      res.status(200).json({
        message: "Fetching data success",
        totalDataCount: data.length,
        data,
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: "There was a server side error",
        err,
      });
    });
});

// GET ONE TODO
router.get("/get/:id", async (req, res) => {
  await Todo.findOne({ _id: req.params.id }, "status date")
    .then((data) => {
      res.status(200).json({ message: "Fetching data success", data });
    })
    .catch((err) => {
      res.status(500).json({
        error: "There was a server side error",
        err,
      });
    });
});

// POST A TODOs
router.post("/", async (req, res) => {
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

// PUT or UPDATE ONE TODOs
router.put("/:id", async (req, res) => {
  await Todo.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { status: "active" } },
    { new: true }
    // (err) => {
    //   if (err) {
    //     console.log(err);
    //     res.status(500).json({
    //       error: "There was a server side error",
    //     });
    //   } else {
    //     res.status(200).json({
    //       message: "TODO Update successfully !!!",
    //     });
    //   }
    // }
  )
    .then((data) => {
      console.log(data);
      res.status(200).json({ message: "Update many successfully", data });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: "There was a Server Side Error!", error });
    });
  // // // ###################################################################################
  // // option 1
  // try {
  //   await Todo.updateOne(
  //     { _id: req.params.id },
  //     {
  //       $set: {
  //         description: "this is update description using try catch block",
  //       },
  //     }
  //   ).then((data) => console.log(data));
  //   // .catch((err) => console.log(err));
  //   res.status(200).json({ message: "Todo Was Update successfully!" });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ message: "There was a Server Side Error!", err });
  // }
  // // // ###################################################################################
  // // option 2 has some confusion
  // await Todo.updateOne(
  //   { _id: req.params.id },
  //   {
  //     $set: {
  //       status: "active",
  //     },
  //   },
  //   (err) => {
  //     if (err) {
  //       res.status(500).json({
  //         error: "There was a server side error",
  //       });
  //     } else {
  //       res.status(200).json({
  //         message: "TODOs data updated successfully !!!",
  //       });
  //     }
  //   }
  // ).clone();
});

// PUT or UPDATE MANY TODOs
// // change someone else put method to active this one
// router.put("/updateAll", async (req, res) => {
//   try {
//     await Todo.updateMany({}, { $set: { status: "inactive" } });
//     res.status(200).json({ message: "Update many successfully" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "There was a Server Side Error!" });
//   }
// });

// DELETE ONE TODO
router.delete("/delete/:id", async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id }, { limit: 1 })
    .then((data) => {
      res.status(200).json({ message: "Data Deleted successfully", data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "There was a Server Side Error!" });
    });
});

module.exports = router;
