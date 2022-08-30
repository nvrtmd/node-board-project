const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../models");

exports.isExistedId = async (req, res, next) => {
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

exports.isCorrectPassword = async (req, res, next) => {
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

exports.isSignedIn = async (req, res, next) => {
  try {
    const token = req.headers.cookie.split("=")[1];
    try {
      const tokenResult = jwt.verify(token, process.env.JWT_SECRET_KEY);
      next();
    } catch {
      return res.status(401).json({
        code: 401,
        message: "user is unauthorized. Need to sign in.",
      });
    }
  } catch {
    return res.status(401).json({
      code: 401,
      message: "user is unauthorized. Need to sign in.",
    });
  }
};
