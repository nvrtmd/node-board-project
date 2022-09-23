const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const adminServices = require("./adminServices");

/**
 * 회원 목록 조회
 */
async function getListOfUsers(req, res) {
  try {
    const usersData = await adminServices.getListOfUsers();
    return res.status(StatusCodes.OK).json({
      data: usersData,
    });
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}

/**
 * 단일 회원 정보 조회
 */
async function getUserDataByUserIndex(req, res) {
  try {
    const userData = await adminServices.getUserDataByUserIndex(req);
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
 * 회원 계정 삭제
 */
async function deleteUserAccount(req, res) {
  try {
    await adminServices.deleteUserAccount(req, res);
  } catch {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send(ReasonPhrases.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  getListOfUsers,
  getUserDataByUserIndex,
  deleteUserAccount,
};
