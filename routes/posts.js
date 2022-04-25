const express = require("express");
const router = express.Router();
const { getData } = require("../controllers/posts");

router.route("/").get(getData);

module.exports = router;
