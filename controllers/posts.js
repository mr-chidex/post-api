exports.getData = async (req, res, next) => {
  try {
    throw new Error("gone bac");
    res.json({ message: "hello world" });
  } catch (err) {
    next(err);
  }
};
