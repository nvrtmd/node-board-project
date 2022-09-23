const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const userServices = require("./userServices");

/**
 * 회원가입
 */
async function signup(req, res, next) {
  try {
    userServices.signup(req);
    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 로그인
 */
async function signin(req, res, next) {
  try {
    userServices.signin(req, res);
    return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 로그아웃
 */
async function signout(req, res, next) {
  try {
    userServices.signout(req, res);
    return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 회원 탈퇴
 */
async function deleteUser(req, res, next) {
  try {
    userServices.deleteUser(req, res);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 회원 정보 조회
 */
async function getProfile(req, res, next) {
  try {
    const userData = userServices.getProfile(req);
    return res.status(StatusCodes.OK).json({
      data: userData,
    });
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 회원 정보 수정
 */
async function modifyProfile(req, res, next) {
  try {
    userServices.modifyProfile(req);
    return res.status(StatusCodes.CREATED).send(ReasonPhrases.CREATED);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  signup,
  signin,
  signout,
  deleteUser,
  getProfile,
  modifyProfile,
};
