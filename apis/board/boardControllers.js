const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { Post } = require("../../models");
const boardServices = require("./boardServices");

/**
 * 게시글 목록 조회
 */
async function getListOfPosts(req, res, next) {
  try {
    const postsData = await boardServices.getListOfPosts();

    return res.status(StatusCodes.OK).json({
      data: postsData,
    });
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 단일 게시글 조회
 */
async function getPostByPostId(req, res, next) {
  try {
    const postData = await boardServices.getPostByPostId(req);
    return res.status(StatusCodes.OK).json({
      data: postData,
    });
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 게시글 생성
 */
async function createPost(req, res) {
  try {
    await boardServices.createPost(req);
    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 게시글 수정
 */
async function modifyPost(req, res) {
  try {
    await boardServices.modifyPost(req);

    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 게시글 삭제
 */
async function deletePost(req, res, next) {
  try {
    await boardServices.deletePost(req, res);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  getListOfPosts,
  getPostByPostId,
  createPost,
  modifyPost,
  deletePost,
};
