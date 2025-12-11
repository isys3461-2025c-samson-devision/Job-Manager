import Joi from "joi";

export const CreateSearchProfileSchema = Joi.object({
  technicalTags: Joi.array().items(Joi.string()).default([]),
  employmentStatus: Joi.array().items(
    Joi.string().valid(
      "Full-time",
      "Part-time",
      "Contract",
      "Fresher",
      "Internship"
    )
  ).default([]),
  country: Joi.string().required(),
  salaryMin: Joi.number().optional(),
  salaryMax: Joi.number().optional(),
  jobTitles: Joi.array().items(Joi.string()).default([]),
});

export const UpdateSearchProfileSchema = CreateSearchProfileSchema.fork(
  Object.keys(CreateSearchProfileSchema.describe().keys),
  (schema) => schema.optional()
);
