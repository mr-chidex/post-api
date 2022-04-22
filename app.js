const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;

const router = require("./routes");

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

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
