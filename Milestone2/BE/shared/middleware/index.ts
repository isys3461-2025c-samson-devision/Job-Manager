import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import { JwtPayload } from "../types";

export function asyncHandler  (fn:(req: Request , res : Response, next: NextFunction) => Promise<any>){
    return (req: Request, res: Response, next: NextFunction): void => {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}

export function validateRequest(schema: any) {
    return (req: Request, res: Response, next: NextFunction)=> {
        const { error } = schema.validate(req.body);

        if(error) {
            const errors : Record<string, string[]> = {};
            error.details.forEach((detail: any) => {
                const field  = detail.path.join('.');
                if(!errors[field]) {
                    errors[field] = [];
                }
                errors[field].push(detail.message);
            });
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors,
            });
        }
        next();


    };
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





    