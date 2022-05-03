const express = require("express");
const router = express.Router();
const {
  getPosts,
  addPost,
  editPost,
  deletePost,
  getPost,
  searchPost,
} = require("../controllers/posts");

router.route("/").get(getPosts).post(addPost);
router.route("/search").get(searchPost);
router.route("/:postId").get(getPost).put(editPost).delete(deletePost);

module.exports = router;
