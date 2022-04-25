const express = require("express");
const router = express.Router();
const {
  getComments,
  addComment,
  editComment,
  deleteComment,
  getComment,
  getCommentsByPost,
  deleteCommentsByPost,
} = require("../controllers/comments");

router.route("/").get(getComments).post(addComment);

router
  .route("/:commentId")
  .get(getComment)
  .put(editComment)
  .delete(deleteComment);

router
  .route("/post/:postId")
  .get(getCommentsByPost)
  .delete(deleteCommentsByPost);

router;

module.exports = router;
