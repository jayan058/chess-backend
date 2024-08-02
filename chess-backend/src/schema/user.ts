import Joi from "joi";

export const createUserSchema = Joi.object({
  userName: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  photo: Joi.string(),
});
