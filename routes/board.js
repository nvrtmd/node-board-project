var express = require("express");
var router = express.Router();

const { Post } = require("../models/index");

router.get("/list", async (req, res, next) => {
  const postsData = await Post.findAll();
  res.json(postsData);
});

module.exports = router;
