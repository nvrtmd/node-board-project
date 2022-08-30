const bcrypt = require("bcryptjs");
const { User } = require("../models");

exports.isExistedId = async (req, res, next) => {
  const userData = await User.findOne({ where: { user_id: req.body.userId } });
  if (!userData) {
    return res.status(404).json({
      code: 404,
      message: "user id doesn't exist",
    });
  } else {
    return next();
  }
};
