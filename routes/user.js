const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const multer = require("multer");
const {
  isExistedId,
  isCorrectPassword,
  isSignedIn,
  isAdminUser,
} = require("./middlewares");

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
 * 회원 정보 조회
 */
router.get("/list", isAdminUser, async (req, res, next) => {
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
    message: "created successfully.",
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

    res.setHeader("Set-Cookie", [
      `token=${token}; Path=/; HttpOnly; SameSite=none; secure=true;`,
      `isSignedin=true; Path=/; SameSite=none; secure=true; Max-Age=900`,
    ]);

    res.status(201).json({
      code: 201,
      message: "created successfully.",
    });
  }
);

/**
 * 로그아웃
 */
router.get("/signout", isSignedIn, async (req, res, next) => {
  const token = req.headers.cookie
    .split(";")
    .filter((cookie) => cookie.trim().slice(0, 5) == "token")[0]
    .split("=")[1];
  res.setHeader(
    "Set-Cookie",
    `token=${token}; Path=/; HttpOnly; SameSite=none; secure=true; Max-Age=0`
  );

  return res.status(200).json({
    code: 200,
    message: "signed out successfully.",
  });
});

/**
 * 회원탈퇴
 */
router.delete("/deleteuser", isSignedIn, async (req, res, next) => {
  const token = req.headers.cookie
    .split(";")
    .filter((cookie) => cookie.trim().slice(0, 5) == "token")[0]
    .split("=")[1];
  const signedInUserId = jwt.verify(token, process.env.JWT_SECRET_KEY).userId;

  const deletedUserData = await User.findOne({
    where: { user_id: signedInUserId },
  });

  if (deletedUserData) {
    await User.destroy({ where: { user_id: signedInUserId } });
    const token = req.headers.cookie
      .split(";")
      .filter((a) => a.slice(0, 5) == "token")[0]
      .split("=")[1];
    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=none; secure=true; Max-Age=0`
    );
    return res.status(200).json({
      code: 200,
      message: "deleted successfully.",
    });
  } else {
    return res.status(404).json({
      code: 404,
      message: "cannot find user.",
    });
  }
});

/**
 * 회원 정보 조회
 */
router.get("/profile", isSignedIn, async (req, res, next) => {
  const token = req.headers.cookie
    .split(";")
    .filter((cookie) => cookie.trim().slice(0, 5) == "token")[0]
    .split("=")[1];
  const signedInUserId = jwt.verify(token, process.env.JWT_SECRET_KEY).userId;

  const userData = await User.findOne({
    where: { user_id: signedInUserId },
  });

  return res.status(200).json({
    code: 200,
    data: userData,
  });
});

/**
 * 회원 정보 수정
 */
router.post("/profile", isSignedIn, async (req, res, next) => {
  const token = req.headers.cookie
    .split(";")
    .filter((cookie) => cookie.trim().slice(0, 5) == "token")[0]
    .split("=")[1];
  const signedInUserId = jwt.verify(token, process.env.JWT_SECRET_KEY).userId;
  const encodedPassword = await bcrypt.hash(req.body.userPassword, 12);

  const modifyUserData = {
    user_id: req.body.userId,
    user_nickname: req.body.userNickname,
    user_password: encodedPassword,
    user_name: req.body.userName,
    user_phone: req.body.userPhone,
  };

  await User.update(modifyUserData, { where: { user_id: signedInUserId } });

  const newUserData = {
    userId: modifyUserData.user_id,
  };
  const newToken = jwt.sign(newUserData, process.env.JWT_SECRET_KEY, {
    expiresIn: "15m",
    issuer: "YUZAMIN",
  });

  res.setHeader(
    "Set-Cookie",
    `token=${newToken}; Path=/; HttpOnly; SameSite=none; secure=true;`
  );

  return res.status(201).json({
    code: 201,
    message: "modified successfully.",
  });
});

module.exports = router;
