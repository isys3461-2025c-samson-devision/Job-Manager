import { z } from "zod";
import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const createProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
  }),
});

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: z.string().optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
  }),
});

export const validate =
  (schema: ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return res.status(400).json({
        errors: result.error.flatten(),
      });
    }

    next();
  };
