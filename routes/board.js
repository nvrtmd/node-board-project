var express = require("express");
var router = express.Router();

const { Post } = require("../models/index");

router.get("/list", async (req, res, next) => {
  const postsData = await Post.findAll();
  res.json(postsData);
});

router.post("/create", async (req, res) => {
  const postData = {
    post_title: req.body.postTitle,
    post_contents: req.body.postContents,
    post_views: 0,
    post_display: JSON.parse(req.body.postDisplay),
    post_register_date: Date.now(),
    post_register_user_name: "anonymous",
  };

  await Post.create(postData);
  res.sendStatus(201);
});

router.get("/:postId", async (req, res) => {
  const postId = req.params.postId;

  const postData = await Post.findOne({ where: { post_id: postId } });
  res.json(postData);
});

module.exports = router;
