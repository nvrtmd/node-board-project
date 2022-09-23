const express = require("express");
const router = express.Router();
const fs = require("fs");
const multer = require("multer");
const userMiddlewares = require("./userMiddlewares");
const userControllers = require("./userControllers");

/**
 * 파일 업로드 용 폴더 생성
 */
// fs.readdir("uploads", (err) => {
//   if (err) {
//     fs.mkdirSync("uploads");
//   }
// });

/**
 * 회원가입
 */
router.post("/signup", userMiddlewares.isValidSignup, userControllers.signup);

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
  userMiddlewares.isValidSignin,
  userMiddlewares.isExistedId,
  userMiddlewares.isCorrectPassword,
  userControllers.signin
);

/**
 * 로그아웃
 */
router.get("/signout", userMiddlewares.isSignedIn, userControllers.signout);

/**
 * 회원 탈퇴
 */
router.delete(
  "/deleteuser",
  userMiddlewares.isSignedIn,
  userControllers.deleteUser
);

/**
 * 회원 정보 조회
 */
router.get("/profile", userMiddlewares.isSignedIn, userControllers.getProfile);

/**
 * 회원 정보 수정
 */
router.post(
  "/profile",
  userMiddlewares.isSignedIn,
  userControllers.modifyProfile
);

module.exports = router;
