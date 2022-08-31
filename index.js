/*
 * Title: toto app
 * Description:toto app using express and mongoose
 * Author: Amit Samadder (Abir)
 * Date: 24/08/2022
 * Time: 21:08:53
 *
 */

// dependencies
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const todoHandler = require("./routerHandler/todoHandler");
const userHandler = require("./routerHandler/userHandler");

// app initialization
const app = express();
dotenv.config();
app.use(express.json());

// database connection with mongoose
mongoose
  // mongodb connection string
  .connect("mongodb://localhost/todos", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connection successful"))
  .catch((err) => console.log(err));

// app handler
app.use("/todo", todoHandler);
app.use("/user", userHandler);

// default error handler
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({ error: err });
};

app.use(errorHandler);

// listen app
app.listen(process.env.PORT, () => {
  console.log(`App running on port no ${process.env.PORT}`);
});
