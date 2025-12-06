// shared typerscript  types definitions for all mircoservices

export interface User {
    id: string;
    email: string;
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
export function logError(error:Error,context?:Record<string,any>) :void {
    console.error("Error orcurred:",{
        message : error.message,
        stack:error.stack,
        context,
        timestamp: new Date().toISOString(),
    });
}