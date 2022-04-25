const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const posts = require("./routes/posts");
const comments = require("./routes/comments");
const users = require("./routes/users");

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//endpoint
app.use("/api/v1/posts", posts);
app.use("/api/v1/comments", comments);
app.use("/api/v1/users", users);

app.use("/", (req, res) => {
  res.json({ message: "express" });
});

app.use((err, _, res, __) => {
  const error = process.env.NODE_ENV === "production" ? err.message : err.stack;
  res
    .status(err.statusCode || 500)
    .json({ message: "error", status: "error", error });
});

app.listen(PORT, () => console.log(`app running on Port - ${PORT}`));
