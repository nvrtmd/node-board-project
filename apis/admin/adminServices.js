const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { User } = require("../../models");

/**
 * 회원 목록 조회
 */
async function getListOfUsers() {
  const usersData = await User.findAll();
  return usersData;
}

/**
 * 단일 회원 정보 조회
 */
async function getUserDataByUserIndex(req) {
  const userIndex = req.params.userIndex;
  const userData = await User.findOne({ where: { id: userIndex } });
  return userData;
}

/**
 * 회원 계정 삭제
 */
async function deleteUserAccount(req, res) {
  const userIndex = req.params.userIndex;
  const deletedUserData = await User.findOne({ where: { id: userIndex } });
  if (deletedUserData) {
    await User.destroy({ where: { id: userIndex } });
    return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
  } else {
    return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
  }
}

module.exports = {
  getListOfUsers,
  getUserDataByUserIndex,
  deleteUserAccount,
};
