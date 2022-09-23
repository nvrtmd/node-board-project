const jwt = require("jsonwebtoken");

const { Post } = require("../models");

async function permitPostModify(req, res, next) {
  const token = req.headers.cookie.split("=")[1];
  const signedInUserId = jwt.verify(token, process.env.JWT_SECRET_KEY).userId;
  const postId = req.params.postId;
  const postData = await Post.findOne({ where: { post_id: postId } });

  if (signedInUserId === postData.post_register_user_name) {
    next();
  } else {
    return res.status(403).json({
      code: 403,
      message: "forbidden to modify or delete the post.",
    });
  }
}

module.exports = {
  permitPostModify,
};
