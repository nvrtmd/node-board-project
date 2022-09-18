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
 * 회원 목록 조회
 */
router.get("/userlist", isAdminUser, async (req, res, next) => {
  const usersData = await User.findAll();
  return res.status(200).json({
    code: 200,
    data: usersData,
  });
});

/**
 * 단일 회원 정보 조회
 */
router.get("/user/:userIndex", isAdminUser, async (req, res, next) => {
  const userIndex = req.params.userIndex;

  const userData = await User.findOne({ where: { id: userIndex } });
  return res.status(200).json({
    code: 200,
    data: userData,
  });
});

module.exports = router;
