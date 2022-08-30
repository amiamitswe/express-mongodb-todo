// dependencies
const bcrypt = require("bcrypt");

const middleWares = {};

middleWares.sighUpMiddleware = async (req, res, next) => {
  const name =
    typeof req.body.name === "string" && req.body.name.trim().length > 2
      ? req.body.name
      : false;
  const username =
    typeof req.body.username === "string" && req.body.username.trim().length > 2
      ? req.body.username
      : false;
  const password =
    typeof req.body.password === "string" && req.body.password.trim().length > 4
      ? req.body.password
      : false;

  const status = req.body.status
    ? typeof req.body.status === "string" &&
      ["active", "inactive"].includes(req.body.status)
      ? req.body.status
      : false
    : "active";

  if (name && username && password && status) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const signupData = {
      name,
      username,
      password: hashedPassword,
      status,
    };

    req.signupData = signupData;
    next();
  } else {
    const errorMessage = {};
    if (!name) {
      errorMessage.name = "Name is required";
    }
    if (!username) {
      errorMessage.username = "Username is required";
    }
    if (!password) {
      errorMessage.password = "Password is required";
    }
    if (!status) {
      errorMessage.status = "Status is should be 'active' or 'inactive'";
    }
    res
      .status(400)
      .json({ message: "All field is required", error: errorMessage });
  }
};

module.exports = middleWares;
