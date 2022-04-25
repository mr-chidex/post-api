const pool = require("../models/db");

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - create a user
 * @access Private
 * @route POST /api/v1/users
 */
exports.createNewUser = async (req, res, next) => {
  try {
    const { username, email, email_verification } = req.body;

    const values = [username, email, email_verification];

    const user = await pool.query(
      `
      INSERT INTO users (username, email, email_verification, date_created)
      VALUES($1 $2, $3, NOW())
      ON CONFLICT DO NOTHING 
    `,
      values
    );

    res.status(201).json({ status: "success", user: user.rows });
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - create a user
 * @access Private
 * @route GET /api/v1/users
 */
exports.getUsers = async (req, res, next) => {
  try {
    const users = await pool.query(
      "SELECT * FROM users ORDER BY date_created DESC"
    );

    res.json({ status: "success", users: users.rows });
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - get user
 * @access Private
 * @route GET /api/v1/users/:userId
 */
exports.getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await pool.query(
      `SELECT * FROM users 
      WHERE uid=$1`,
      [userId]
    );

    res.json({ status: "success", user: user.rows });
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - get user
 * @access Private
 * @route GET /api/v1/users/post/:userId
 */
exports.getUserPosts = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userPosts = await pool.query(
      `SELECT * FROM posts 
      WHERE user_id=$1`,
      [userId]
    );

    res.json({ status: "success", userPosts: userPosts.rows });
  } catch (err) {
    next(err);
  }
};

/**
 *
 * @param {object} req
 * @param {object} res
 * @description - delete user
 * @access Private
 * @route DELETE /api/v1/users/:userId
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    //delete comments assocaited with post
    await pool.query(
      `
      DELETE FROM comments 
      WHERE user_id = $1
    `,
      [userId]
    );

    //delete posts assocaited with post
    await pool.query(
      `
        DELETE FROM posts 
        WHERE user_id = $1
      `,
      [userId]
    );

    //delete user
    const user = await pool.query(
      `
      DELETE FROM users 
      WHERE uid = $1
    `,
      [userId]
    );

    res.json({ status: "success", user: user.rows });
  } catch (error) {
    next(error);
  }
};
