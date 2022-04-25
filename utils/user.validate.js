const joi = require("joi");

const userValidate = (user) => {
  return joi
    .object({
      username: joi.string().trim().required(),
      email: joi.string().trim().required().email().normalize(),
    })
    .validate(user);
};

module.exports = userValidate;
