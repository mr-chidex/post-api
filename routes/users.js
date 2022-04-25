const express = require("express");
const router = express.Router();
const {
  getUser,
  getUserPosts,
  getUsers,
  deleteUser,
  createNewUser,
} = require("../controllers/users");

router.route("/").get(getUser).post(createNewUser);
router.route("/:userId").get(getUsers).delete(deleteUser);
router.route("/post/:userId").get(getUserPosts);

module.exports = router;
