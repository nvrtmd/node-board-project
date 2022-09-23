const express = require("express");
const router = express.Router();
const userMiddlewares = require("../middlewares/userMiddlewares");
const { User } = require("../models/index");

/**
 * 회원 목록 조회
 */
router.get("/userlist", userMiddlewares.isAdminUser, async (req, res, next) => {
  const usersData = await User.findAll();
  return res.status(200).json({
    code: 200,
    data: usersData,
  });
});

/**
 * 단일 회원 정보 조회
 */
router.get(
  "/user/:userIndex",
  userMiddlewares.isAdminUser,
  async (req, res, next) => {
    const userIndex = req.params.userIndex;

    const userData = await User.findOne({ where: { id: userIndex } });
    return res.status(200).json({
      code: 200,
      data: userData,
    });
  }
);

/**
 * 회원 계정 삭제
 */
router.delete(
  "/user/:userIndex",
  userMiddlewares.isAdminUser,
  async (req, res, next) => {
    const userIndex = req.params.userIndex;
    const deletedUserData = await User.findOne({ where: { id: userIndex } });

    if (deletedUserData) {
      await User.destroy({ where: { id: userIndex } });
      return res.status(200).json({
        code: 200,
        message: "user is deleted successfully.",
      });
    } else {
      return res.status(404).json({
        code: 404,
        message: "cannot find user.",
      });
    }
  }
);

module.exports = router;
