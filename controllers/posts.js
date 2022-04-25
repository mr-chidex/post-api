const pool = require("../models/db");
const postValidate = require("../utils/post.validate");

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - get all post
 * @access Public
 * @route GET /api/v1/posts
 */
exports.getPosts = async (req, res, next) => {
  try {
    const posts = await pool.query(
      "SELECT * FROM posts ORDER BY date_created DESC"
    );

    res.json({ status: "success", posts: posts.rows });
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - get post
 * @access Public
 * @route GET /api/v1/posts/:postId
 */
exports.getPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await pool.query("SELECT * FROM posts WHERE pid =$1", [
      postId,
    ]);

    res.json({ status: "success", post: post.rows });
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - add a post
 * @access Public
 * @route POST /api/v1/posts
 */
exports.addPost = async (req, res, next) => {
  try {
    const { error, value } = postValidate(req.body);

    if (error)
      return res
        .status(400)
        .json({ status: "error", message: error.details[0].message });

    const { title, body, uid, username } = value;
    const values = [uid, title, body, username];

    await pool.query(
      `
      INSERT INTO posts (user_id, title, body, author, date_created)
      VALUES($1 $2, $3, $4, NOW())
    `,
      values
    );

    res
      .status(201)
      .json({ status: "success", message: "post successfully added" });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - edit a post
 * @access Private
 * @route PUT /api/v1/posts/:postId
 */
exports.editPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const { title, body, uid, username } = req.body;
    const values = [uid, title, body, username, postId];

    const post = await pool.query(
      `
      SELECT * FROM posts
      WHERE pid = $1
    `,
      [postId]
    );

    if (post.rows.length <= 0)
      return res
        .status(400)
        .json({ status: "error", message: "post with id does not exist" });

    await pool.query(
      `
      UPDATE posts 
      SET user_id=$1, title=$2, body=$3, author=$4, date_created=NOW()
      WHERE pid = $5
    `,
      values
    );

    res.json({ status: "success", message: "post successfully added" });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - delete a post
 * @access Private
 * @route DELETE /api/v1/posts/:postId
 */
exports.deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const post = await pool.query(
      `
      SELECT * FROM posts
      WHERE pid = $1
    `,
      [postId]
    );

    if (post.rows.length <= 0)
      return res
        .status(400)
        .json({ status: "error", message: "post with id does not exist" });

    //delete comment assocaited with post
    await pool.query(
      `
      DELETE FROM comments 
      WHERE post_id = $1
    `,
      [postId]
    );

    //delete post
    await pool.query(
      `
      DELETE FROM posts 
      WHERE pid = $1
    `,
      [postId]
    );

    res.json({ status: "success", message: "post successfully deleted" });
  } catch (error) {
    next(error);
  }
};
