const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { permitPostModify } = require("../middlewares/boardMiddlewares");
const { isSignedIn } = require("../middlewares/userMiddlewares");

const { Post } = require("../models/index");

/**
 * 게시글 목록 조회
 */
router.get("/list", async (req, res, next) => {
  const postsData = await Post.findAll();

  return res.status(200).json({
    code: 200,
    data: postsData,
  });
});

/**
 * 단일 게시글 조회
 */
router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;

  const postData = await Post.findOne({ where: { post_id: postId } });
  const updatePostViews = {
    post_views: postData.post_views + 1,
  };

  await Post.update(updatePostViews, { where: { post_id: postId } });

  return res.status(200).json({
    code: 200,
    data: postData,
  });
});

/**
 * 게시글 생성
 */
router.post("/create", isSignedIn, async (req, res) => {
  const token = req.headers.cookie.split("=")[1];
  const signedInUserId = jwt.verify(token, process.env.JWT_SECRET_KEY).userId;

  const postData = {
    post_title: req.body.postTitle,
    post_contents: req.body.postContents,
    post_views: 0,
    post_display: JSON.parse(req.body.postDisplay),
    post_register_date: Date.now(),
    post_register_user_name: signedInUserId,
  };

  await Post.create(postData);

  return res.status(201).json({
    code: 201,
    message: "created successfully.",
  });
});

/**
 * 게시글 수정
 */
router.post(
  "/modify/:postId",
  isSignedIn,
  permitPostModify,
  async (req, res) => {
    const postId = req.params.postId;
    const token = req.headers.cookie.split("=")[1];
    const signedInUserId = jwt.verify(token, process.env.JWT_SECRET_KEY).userId;

    const modifyPostData = {
      post_title: req.body.postTitle,
      post_contents: req.body.postContents,
      post_display: JSON.parse(req.body.postDisplay),
      post_modify_date: Date.now(),
      post_modify_user_name: signedInUserId,
    };

    await Post.update(modifyPostData, { where: { post_id: postId } });

    return res.status(201).json({
      code: 201,
      message: "modified successfully.",
    });
  }
);

/**
 * 게시글 삭제
 */
router.delete(
  "/delete/:postId",
  isSignedIn,
  permitPostModify,
  async (req, res) => {
    const postId = req.params.postId;
    const deletedPostData = await Post.findOne({ where: { post_id: postId } });

    if (deletedPostData) {
      await Post.destroy({ where: { post_id: postId } });
      return res.status(200).json({
        code: 200,
        message: "post is deleted successfully.",
      });
    } else {
      return res.status(404).json({
        code: 404,
        message: "cannot find post.",
      });
    }
  }
);

module.exports = router;
