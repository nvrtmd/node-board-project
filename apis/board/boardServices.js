const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { Post } = require("../../models");

/**
 * 게시글 목록 조회
 */
async function getListOfPosts() {
  const postsData = await Post.findAll();
  return postsData;
}

/**
 * 단일 게시글 조회
 */
async function getPostByPostId(req) {
  const postId = req.params.postId;

  const previousPostData = await Post.findOne({ where: { post_id: postId } });
  const updatePostViews = {
    post_views: previousPostData.post_views + 1,
  };
  await Post.update(updatePostViews, { where: { post_id: postId } });
  const postData = Object.assign({}, previousPostData);
  postData.post_views = previousPostData.post_views + 1;
  return postData;
}

/**
 * 게시글 생성
 */
async function createPost(req) {
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
}

/**
 * 게시글 수정
 */
async function modifyPost(req) {
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
}

/**
 * 게시글 삭제
 */
async function deletePost(req, res) {
  const postId = req.params.postId;
  const deletedPostData = await Post.findOne({ where: { post_id: postId } });

  if (deletedPostData) {
    await Post.destroy({ where: { post_id: postId } });
    return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  } else {
    return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
  }
}

module.exports = {
  getListOfPosts,
  getPostByPostId,
  createPost,
  modifyPost,
  deletePost,
};
