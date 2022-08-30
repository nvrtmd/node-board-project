const bcrypt = require("bcryptjs");
const { User } = require("../models");

exports.isExistedId = async (req, res, next) => {
  const userData = await User.findOne({ where: { user_id: req.body.userId } });
  if (userData) {
    return next();
  } else {
    return res.status(404).json({
      code: 404,
      message: "user id doesn't exist",
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
      message: "user password isn't correct",
    });
  }
};
