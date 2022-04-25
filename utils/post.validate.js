const joi = require("joi");

const postValidate = (post) => {
  return joi
    .object({
      title: joi.string().trim().required(),
      body: joi.string().trim().required(),
      uid: joi.string().trim().required(),
      username: joi.string().trim().required(),
    })
    .validate(post);
};

module.exports = postValidate;
