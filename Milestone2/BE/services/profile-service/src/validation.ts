import Joi from "joi";

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().optional(),
  headline: Joi.string().optional(),
  bio: Joi.string().max(500).optional(),

  // Experience, Skills, etc. later
});
