const pool = require("../models/db");
const userValidate = require("../utils/user.validate");

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
    const { error, value } = userValidate(req.body);

    if (error)
      return res
        .status(400)
        .json({ status: "error", message: error.details[0].message });

    const { username, email, email_verification } = value;

    const values = [username, email, email_verification];

    const userExist = await pool.query(
      `
    SELECT * FROM users WHERE email=$1 OR username=$2
    `,
      [email, username]
    );

    if (userExist.rows.length > 0)
      return res
        .status(400)
        .json({ status: "error", message: "email or username already exist" });

    await pool.query(
      `
      INSERT INTO users (username, email, email_verification, date_created)
      VALUES($1, $2, $3, NOW())
      ON CONFLICT DO NOTHING 
    `,
      values
    );

    res
      .status(201)
      .json({ status: "success", message: "user successfully added" });
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

    if (!userId)
      return res
        .status(400)
        .json({ status: "error", message: "user id not provided." });

    const user = await pool.query(
      `SELECT * FROM users 
      WHERE uid=$1`,
      [userId]
    );

    res.json({ status: "success", user: user.rows[0] });
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

    if (!userId)
      return res
        .status(400)
        .json({ status: "error", message: "user id not provided." });

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

    if (!userId)
      return res
        .status(400)
        .json({ status: "error", message: "user id not provided." });

    const user = await pool.query(
      `
      SELECT * FROM users
      WHERE uid = $1
    `,
      [userId]
    );

    if (user.rows.length <= 0)
      return res
        .status(400)
        .json({ status: "error", message: "user with id does not exist" });

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
    await pool.query(
      `
      DELETE FROM users 
      WHERE uid = $1
    `,
      [userId]
    );

    res.json({ status: "success", message: "user successfully deleted" });
  } catch (error) {
    next(error);
  }
};
