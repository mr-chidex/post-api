const joi = require("joi");

const UserValidate = (user) => {
  return joi
    .object({
      username: joi.string().trim().required(),
      email: joi.string().trim().required().email().normalize(),
    })
    .validate(user);
};

export default UserValidate;
