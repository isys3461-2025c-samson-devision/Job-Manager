import Joi from "joi";

export const uploadAvatarSchema = Joi.object({
  // These are form-data text fields
  title: Joi.string().max(100).optional(),
  description: Joi.string().max(500).optional(),
  tags: Joi.string().optional() // Will parse in middleware
});

// For portfolio upload (form-data)  
export const uploadPortfolioSchema = Joi.object({
  title: Joi.string().max(100).optional(),
  description: Joi.string().max(500).optional(),
  tags: Joi.string().optional()
});

// For updating media metadata (JSON)
export const updateMediaSchema = Joi.object({
  title: Joi.string().max(100).optional(),
  description: Joi.string().max(500).optional(),
  tags: Joi.array().items(Joi.string().max(50)).max(10).optional()
});