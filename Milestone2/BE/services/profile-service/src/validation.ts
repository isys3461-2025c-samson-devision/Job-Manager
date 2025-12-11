import Joi from "joi";

export const updateProfileSchema = Joi.object({
  name: Joi.string().optional()
});
