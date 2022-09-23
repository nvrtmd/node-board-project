const { StatusCodes, ReasonPhrases } = require("http-status-codes");

/**
 * 회원가입
 */
async function signup(req, res, next) {
  try {
    const encodedPassword = await bcrypt.hash(req.body.userPassword, 12);
    const userData = {
      user_id: req.body.userId,
      user_nickname: req.body.userNickname,
      user_password: encodedPassword,
      user_name: req.body.userName,
      user_phone: req.body.userPhone,
      // user_profile_image: req.body.userProfileImage,
    };
    await User.create(userData);

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
    const userData = {
      userId: req.body.userId,
    };

    const token = jwt.sign(userData, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
      issuer: process.env.JWT_ISSUER,
    });

    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=none; secure=true;`
    );

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
    const token = req.headers.cookie.split("=")[1];

    res.setHeader(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=none; secure=true; Max-Age=0`
    );

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
    const token = req.headers.cookie.split("=")[1];
    const signedInUserId = jwt.verify(token, process.env.JWT_SECRET_KEY).userId;

    const deletedUserData = await User.findOne({
      where: { user_id: signedInUserId },
    });

    if (deletedUserData) {
      await User.destroy({ where: { user_id: signedInUserId } });
      const token = req.headers.cookie.split("=")[1];
      res.setHeader(
        "Set-Cookie",
        `token=${token}; Path=/; HttpOnly; SameSite=none; secure=true; Max-Age=0`
      );

      return res.status(StatusCodes.OK).send(ReasonPhrases.OK);
    } else {
      return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND);
    }
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
    const token = req.headers.cookie.split("=")[1];
    const signedInUserId = jwt.verify(token, process.env.JWT_SECRET_KEY).userId;

    const userData = await User.findOne({
      where: { user_id: signedInUserId },
    });
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
    const token = req.headers.cookie.split("=")[1];
    const signedInUserId = jwt.verify(token, process.env.JWT_SECRET_KEY).userId;
    const encodedPassword = await bcrypt.hash(req.body.userPassword, 12);

    const modifyUserData = {
      user_id: req.body.userId,
      user_nickname: req.body.userNickname,
      user_password: encodedPassword,
      user_name: req.body.userName,
      user_phone: req.body.userPhone,
    };

    await User.update(modifyUserData, { where: { user_id: signedInUserId } });

    const newUserData = {
      userId: modifyUserData.user_id,
    };
    const newToken = jwt.sign(newUserData, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE_TIME,
      issuer: process.env.JWT_ISSUER,
    });

    res.setHeader(
      "Set-Cookie",
      `token=${newToken}; Path=/; HttpOnly; SameSite=none; secure=true;`
    );
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
