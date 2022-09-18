const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  isExistedId,
  isCorrectPassword,
  isSignedIn,
  isAdminUser,
} = require("./middlewares");

const { User } = require("../models/index");

/**
 * 회원 정보 조회
 */
router.get("/userlist", isAdminUser, async (req, res, next) => {
  const usersData = await User.findAll();
  res.json(usersData);
});

module.exports = router;
