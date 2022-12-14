const express = require("express");
const mongoose = require("mongoose");
const checkLogin = require("../middleware/checkLogin");
const todoSchema = require("../schemas/todoSchema");
const userSchema = require("../schemas/userSchema");

const router = express.Router();

// make todo modal, this mainly return a class
const Todo = new mongoose.model("Todo", todoSchema);
const User = new mongoose.model("User", userSchema);

// GET A TODO (instance method)
router.get("/activeTodo", checkLogin, async (req, res) => {
  try {
    const todo = new Todo();
    const result = await todo
      .findActive()
      .select({
        // _id: 0,
        // date: 0,
        title: 0,
        status: 0,
        __v: 0,
      })
      .limit(200);
    res.status(200).json({
      message: "Fetching data success",
      totalDataCount: result.length,
      result,
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      err,
    });
  }
});

// GET A TODO using CallBack (instance method with parm)
router.get("/activeTodo-cb", checkLogin, (req, res) => {
  const todo = new Todo();
  todo.findActiveCb((err, data) => {
    if (err) {
      res.status(500).json({
        error: "There was a server side error",
        err,
      });
    } else {
      res.status(200).json({
        message: "Fetching data success",
        totalDataCount: data.length,
        data,
      });
    }
  });
});

// GET A TODOs with title js (static method)
router.get("/js", checkLogin, async (req, res) => {
  try {
    const result = await Todo.findByJs().limit(2).select({
      __v: 0,
    });
    res.status(200).json({
      message: "Fetching data success using static method",
      totalDataCount: result.length,
      result,
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

// GET A TODOs with title language (query helpers)
router.get("/language", checkLogin, async (req, res) => {
  try {
    const result = await Todo.find().findByLanguage("express");
    res.status(200).json({
      message: "Fetching data success using query helpers",
      totalDataCount: result.length,
      result,
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

// GET ALL TODOs
router.get("/", checkLogin, async (req, res) => {
  // // // bad 1
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
  // // // bad 2
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
  // // // bad 3
  // await Todo.find({ status: "active" })
  //   .select({
  //     // _id: 0,
  //     // date: 0,
  //     // title: 0,
  //     status: 0,
  //     __v: 0,
  //   })
  //   .limit(200)
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
  try {
    const result = await Todo.find({ status: "active" })
      .populate("user", "name username status -_id")
      .select({
        // _id: 0,
        // date: 0,
        // title: 0,
        // status: 0,
        __v: 0,
      })
      .limit(200);
    res.status(200).json({
      message: "Fetching data success",
      totalDataCount: result.length,
      result,
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      err,
    });
  }
});

// GET ONE TODO
router.get("/get/:id", checkLogin, async (req, res) => {
  try {
    const data = await Todo.findOne({ _id: req.params.id }, "status date");
    res.status(200).json({ message: "Fetching data success", data });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
      err,
    });
  }
});

// POST A TODOs
router.post("/", checkLogin, async (req, res) => {
  const bodyData = {
    ...req.body,
    user: req.userId,
  };
  const newToDO = new Todo(bodyData);
  try {
    const result = await newToDO.save();
    await User.updateOne(
      {
        _id: req.userId,
      },
      {
        $push: {
          allTodo: result._id,
        },
      }
    );
    res.status(200).json({
      message: "TODO inserted successfully !!!",
      result,
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

// POST MULTIPLE TODOs
router.post("/all", checkLogin, async (req, res) => {
  try {
    const result = await Todo.insertMany(req.body);
    res.status(200).json({
      message: "TODOs are inserted successfully !!!",
      result,
    });
  } catch (err) {
    res.status(500).json({
      error: "There was a server side error",
    });
  }
});

// PUT or UPDATE ONE TODOs
router.put("/:id", checkLogin, (req, res) => {
  // // // ###################################################################################
  // // option 1
  // try {
  //   const result = await Todo.findOneAndUpdate(
  //     { _id: req.params.id },
  //     {
  //       $set: {
  //         status: "inactive",
  //         // description: "this is update description using try catch block",
  //       },
  //     },
  //     { new: true }
  //   );
  //   res.status(200).json({ message: "Todo Was Update successfully!", result });
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ message: "There was a Server Side Error!", err });
  // }
  // // // ###################################################################################
  // // option 2

  const title =
    typeof req.body.title === "string" && req.body.title.trim().length > 2
      ? req.body.title
      : false;
  const description =
    typeof req.body.description === "string" &&
    req.body.description.trim().length > 10
      ? req.body.description
      : false;

  if (title && description) {
    Todo.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          status: req.body.status,
          title,
          description,
          date: new Date(),
        },
      },
      { new: true },
      (err, data) => {
        if (err) {
          res.status(500).json({
            error: "There was a server side error",
          });
        } else {
          res.status(200).json({
            message: "TODOs data updated successfully !!!",
            data,
          });
        }
      }
    );
  } else {
    const errorMessage = {};
    if (!title) {
      errorMessage.title = "title is required";
    }
    if (!description) {
      errorMessage.description = "description is required";
    }
    res.status(400).json({
      message: "Please provide all data",
      errorMessage,
    });
  }
});

// PUT or UPDATE MANY TODOs
// // change someone else put method to active this one
// router.put("/updateAll", async (req, res) => {
//   try {
//     const result = await Todo.updateMany({}, { $set: { status: "inactive" } });
//     res.status(200).json({ message: "Update many successfully", result });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ error: "There was a Server Side Error!" });
//   }
// });

// DELETE MANY TODOs
router.delete("/delete/all", checkLogin, async (req, res) => {
  try {
    const result = await Todo.deleteMany({});
    res.status(200).json({ message: "Data delete success", result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "There was a Server Side Error!" });
  }
});

// // DELETE ONE TODO
// router.delete("/delete/:id",checkLogin, async (req, res) => {
//   await Todo.deleteOne({ _id: req.params.id }, { limit: 1 })
//     .then((data) => {
//       res.status(200).json({ message: "Data Deleted successfully", data });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).json({ error: "There was a Server Side Error!" });
//     });
// });

module.exports = router;
