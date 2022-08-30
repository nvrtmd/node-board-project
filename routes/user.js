const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const { isExistedId, isCorrectPassword } = require("./middlewares");

const { User } = require("../models/index");

/**
 * 파일 업로드 용 폴더 생성
 */
fs.readdir("uploads", (err) => {
  if (err) {
    fs.mkdirSync("uploads");
  }
});

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
    // user_profile_image: req.body.userProfileImage,
  };
  await User.create(userData);
  return res.status(201).json({
    code: 201,
    message: "user is created",
  });
});

/**
 * (개발용) 회원가입 페이지
 */
router.get("/signup", async (req, res, next) => {
  res.render("user/signUp");
});

/**
 * 로그인
 * 사용자가 id, password 전송 -> DB의 정보와 대조 -> 일치하면 쿠키에 jwt 넣어서 보냄 -> 사용자는 인증이 필요한 접근 때마다 쿠키로 jwt 넣어서 보내기
 */
router.post(
  "/signin",
  isExistedId,
  isCorrectPassword,
  async (req, res, next) => {
    const userData = {
      userId: req.body.userId,
    };

    const token = jwt.sign(userData, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
      issuer: "YUZAMIN",
    });

    res.cookie("token", token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

    res.status(200).json({
      code: 200,
      message: "jwt is created",
    });
  }
);

module.exports = router;