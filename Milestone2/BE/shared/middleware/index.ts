import { Request, Response, NextFunction } from "express";
import { JwtPayload, logError, ServiceError } from "../types";
import { createErrorResponse } from "../utils";
import jwt from "jsonwebtoken";
import multer from 'multer';

//extends express request to include async handler

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer token

  if (!token) {
    return res.status(401).json(createErrorResponse("Access token required"));
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    logError(new Error("JWT_SECRET is not defined"));
    return res.status(500).json(createErrorResponse("Internal Server Error"));
  }

  jwt.verify(token, jwtSecret, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json(createErrorResponse("Invalid token"));
    }

    req.user = decoded as JwtPayload; // Attach user info to request
    next();
  });
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function validateRequest(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);

    if (error) {
      const errors: Record<string, string[]> = {};
      error.details.forEach((detail: any) => {
        const field = detail.path.join(".");
        if (!errors[field]) {
          errors[field] = [];
        }
        errors[field].push(detail.message);
      });
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors,
      });
    }
    next();
  };
}

export function errorHandler(
  error: ServiceError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  logError(error, {
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
  });
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json(createErrorResponse(message));

  next();
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "Missing Authorization header" });

  const token = header.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Invalid Authorization format" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

const storage = multer.memoryStorage();

// Create multer instance WITHOUT fileFilter to avoid issues
export const avatarUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max for avatars
    files: 1
  }
});

export const portfolioUpload = multer({
  storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max for portfolio items
    files: 1
  }
});





    
