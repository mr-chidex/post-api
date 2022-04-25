const pool = require("../models/db");

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - get all comments
 * @access Private
 * @route /api/v1/comments
 */
exports.getComments = async (req, res, next) => {
  try {
    const comments = await pool.query(
      "SELECT * FROM comments ORDER BY date_created DESC"
    );

    res.json({ status: "success", comments: comments.rows });
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - get all post comments
 * @access Public
 * @route GET /api/v1/comments/post/:postId
 */
exports.getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await pool.query(
      `
      SELECT * FROM comments 
      WHERE post_id = $1
      ORDER BY date_created DESC
    `,
      [postId]
    );

    res.json({ status: "success", comments: comments.rows });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - get comment
 * @access Public
 * @route GET /api/v1/comments/:commentId
 */
exports.getComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await pool.query("SELECT * FROM comments WHERE pid =$1", [
      commentId,
    ]);

    res.json({ status: "success", comment: comment.rows });
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - add a comment
 * @access Public
 * @route POST /api/v1/comments
 */
exports.addComment = async (req, res, next) => {
  try {
    const { comment, username, uid, pid } = req.body;
    const values = [comment, username, uid, pid];

    const newComment = await pool.query(
      `
      INSERT INTO comments (comment, author, user_id, post_id, date_created)
      VALUES($1 $2, $3, $4, NOW() )
    `,
      values
    );

    res.status(201).json({ status: "success", comment: newComment.rows });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - edit a comment
 * @access Private
 * @route PUT /api/v1/comments/:commentId
 */
exports.editComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const { comment, username, uid, pid } = req.body;
    const values = [comment, username, uid, pid, commentId];

    const updatedComment = await pool.query(
      `
      UPDATE comments 
      SET user_id=$1, title=$2, body=$3, author=$4, date_created=NOW()
      WHERE pid = $5
    `,
      values
    );

    res.json({ status: "success", post: updatedComment.rows });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - delete a comment
 * @access Private
 * @route DELETE /api/v1/comments/:commentId
 */
exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    const comment = await pool.query(
      `
      DELETE FROM comments 
      WHERE cid = $1
    `,
      [commentId]
    );

    res.json({ status: "success", comment: comment.rows });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - delete all post comment
 * @access Private
 * @route DELETE /api/v1/comments/post/:postId
 */
exports.deleteCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await pool.query(
      `
      DELETE FROM comments 
      WHERE cid = $1
    `,
      [postId]
    );

    res.json({ status: "success", comments: comments.rows });
  } catch (error) {
    next(error);
  }
};
