const jwt = require("jsonwebtoken");

const checkLogin = (req, res, next) => {
  const { authorization } = req.headers;

  try {
    const authToken = authorization.split(" ")[1];
    const decode = jwt.verify(authToken, process.env.JWT_SECRET);
    req.username = decode.username;
    req.userId = decode.userId;
    next();
  } catch {
    next("Authentication Failed !");
  }
};

module.exports = checkLogin;
