const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { User } = require("../models/index");

/**
 * (개발용) 회원 정보 조회
 */
router.get("/list", async (req, res, next) => {
  const usersData = await User.findAll();
  res.json(usersData);
});

/**
 * 회원가입
 */
router.post("/signup", async (req, res, next) => {
  const encodedPassword = await bcrypt.hash(req.body.userPassword, 12);
  const userData = {
    user_id: req.body.userId,
    user_nickname: req.body.userNickname,
    user_password: encodedPassword,
    user_name: req.body.userName,
    user_phone: req.body.userPhone,
    user_profile_pic: req.body.userProfilePic,
  };

  await User.create(userData);
  res.sendStatus(201);
});

module.exports = router;
