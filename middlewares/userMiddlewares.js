const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");

const { User } = require("../models");

const isValidSignin = [
  body("userId").notEmpty().withMessage("please enter user id."),
  body("userPassword")
    .trim()
    .notEmpty()
    .withMessage("please enter user password."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ code: 400, message: errors.array().map((error) => error.msg) });
    }
    next();
  },
];

const isExistedId = async (req, res, next) => {
  const userData = await User.findOne({ where: { user_id: req.body.userId } });
  if (userData) {
    return next();
  } else {
    return res.status(404).json({
      code: 404,
      message: "user id doesn't exist.",
    });
  }
};

const isCorrectPassword = async (req, res, next) => {
  const userData = await User.findOne({ where: { user_id: req.body.userId } });

  const isCorrectPassword = await bcrypt.compare(
    req.body.userPassword,
    userData.user_password
  );

  if (isCorrectPassword) {
    return next();
  } else {
    return res.status(404).json({
      code: 404,
      message: "user password isn't correct.",
    });
  }
};

const isSignedIn = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split("=")[1];
    try {
      const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
      next();
    } catch {
      return res.status(401).json({
        code: 401,
        message: "unauthorized user. Need to sign in.",
      });
    }
  } catch {
    return res.status(401).json({
      code: 401,
      message: "unauthorized user. Need to sign in.",
    });
  }
};

const isAdminUser = async (req, res, next) => {
  const token = req.headers.cookie.split("=")[1];
  const signedInUserId = jwt.verify(token, process.env.JWT_SECRET_KEY).userId;
  const signedInUserData = await User.findOne({
    where: { user_id: signedInUserId },
  });
  const adminUserData = await User.findOne({ where: { user_id: "admin" } });

  if (signedInUserId === "admin") {
    if (signedInUserData.user_password == adminUserData.user_password) {
      next();
    } else {
      return res.status(403).json({
        code: 403,
        message: "forbidden to access.",
      });
    }
  }
};

module.exports = {
  isExistedId,
  isCorrectPassword,
  isSignedIn,
  isAdminUser,
  isValidSignin,
};
