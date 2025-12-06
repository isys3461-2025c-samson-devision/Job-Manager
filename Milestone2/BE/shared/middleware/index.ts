import { Request, Response, NextFunction } from 'express';
import { logError, ServiceError } from '../types';
import {createErrorResponse} from '../utils';
import jwt from 'jsonwebtoken'; 



//extends express request to include async handler

declare global{
    namespace Express{
        interface Request {
            user?: any;
        }
    }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json(createErrorResponse('Access token is missing'));
    }

    const jwtSercet = process.env.JWT_SECRET;
  if (!jwtSercet) { 
    logError(new Error('JWT_SECRET is not defined in environment variables'));
    return res.status(500).json(createErrorResponse('Internal server error'));
}


}


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

export function errorHandler(
    error: ServiceError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    logError(error,{
        method: req.method,
        url: req.url,
        body: req.body,
        params: req.params,
        query: req.query,
    });
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    res.status(statusCode).json(createErrorResponse(message));

    next();

}

    