// shared typerscript  types definitions for all mircoservices
import "express";

declare module "express" {
  interface Request {
    user?: JwtPayload;
  }
}

export interface User {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    errors?: Record<string, string[]>;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}

export class ServiceError extends Error {
    statusCode: number;
    code?:String;
    details?:any;

    constructor(message: string, statusCode: number = 500, code?:String, details?:any) {
       super(message);
        this.name = 'ServiceError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;

    }
}