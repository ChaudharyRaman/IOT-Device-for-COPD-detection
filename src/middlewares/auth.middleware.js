const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const adminModel = require("../models/admin.model");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //   req.user = await adminModel
      //     .findOne({ id: decoded.id })
      //     .select("-password");
      const {password, ...user} = decoded.id;
      req.user = user;
      next();
    } catch (error) {
      res.status(400);
      throw new Error("Not Authorized, token Failed");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("No Token, Not Authorized");
  }
});

module.exports = protect;
