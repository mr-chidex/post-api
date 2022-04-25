const joi = require("joi");

const commentValidate = (comment) => {
  return joi
    .object({
      comment: joi.string().trim().required(),
      pid: joi.string().trim().required(),
      uid: joi.string().trim().required(),
      username: joi.string().trim().required(),
    })
    .validate(comment);
};

module.exports = commentValidate;
