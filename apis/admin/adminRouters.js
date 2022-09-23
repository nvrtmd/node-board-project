const express = require("express");
const router = express.Router();
const userMiddlewares = require("../user/userMiddlewares");
const adminControllers = require("./adminControllers");

/**
 * 회원 목록 조회
 */
router.get(
  "/userlist",
  userMiddlewares.isAdminUser,
  adminControllers.getListOfUsers
);

/**
 * 단일 회원 정보 조회
 */
router.get(
  "/user/:userIndex",
  userMiddlewares.isAdminUser,
  adminControllers.getUserDataByUserIndex
);

/**
 * 회원 계정 삭제
 */
router.delete(
  "/user/:userIndex",
  userMiddlewares.isAdminUser,
  adminControllers.deleteUserAccount
);

module.exports = router;
