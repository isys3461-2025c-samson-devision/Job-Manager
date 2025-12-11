import Joi from "joi";

export const updateProfileSchema = Joi.object({
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  city: Joi.string().optional(),
  country: Joi.string().optional()
});
