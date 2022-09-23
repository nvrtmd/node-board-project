const express = require("express");
const router = express.Router();
const boardMiddlewares = require("./boardMiddlewares");
const userMiddlewares = require("../user/userMiddlewares");
const boardControllers = require("./boardControllers");

/**
 * 게시글 목록 조회
 */
router.get("/list", boardControllers.getListOfPosts);

/**
 * 단일 게시글 조회
 */
router.get("/:postId", boardControllers.getPostByPostId);

/**
 * 게시글 생성
 */
router.post("/create", userMiddlewares.isSignedIn, boardControllers.createPost);

/**
 * 게시글 수정
 */
router.post(
  "/modify/:postId",
  userMiddlewares.isSignedIn,
  boardMiddlewares.permitPostModify,
  boardControllers.modifyPost
);

/**
 * 게시글 삭제
 */
router.delete(
  "/delete/:postId",
  userMiddlewares.isSignedIn,
  boardMiddlewares.permitPostModify,
  boardControllers.deletePost
);

module.exports = router;
