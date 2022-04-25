const pool = require("../models/db");

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
