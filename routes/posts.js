const express = require("express");
const router = express.Router();
const {
  getPosts,
  addPost,
  editPost,
  deletePost,
  getPost,
} = require("../controllers/posts");

router.route("/").get(getPosts).post(addPost);
router.route("/:postId").get(getPost).put(editPost).delete(deletePost);

module.exports = router;
