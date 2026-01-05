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
    userId?: string; 
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
  code?: String;
  details?: any;

    constructor(message: string, statusCode: number = 500, code?:String, details?:any) {
       super(message);
        this.name = 'ServiceError';
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;

    }
}

// Duplicate interface removed to avoid conflicts
export function logError(error: Error, context?: Record<string, any>): void {
  console.error("Error occurred:", {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
}

export interface LoginResponse extends AuthTokens {
  userId: string; 
  email: string;
}
// Removed redundant JWTPayload alias; use JwtPayload consistently

export interface KafkaConfig {
  clientId: string;
  brokers: string[];
  ssl?: boolean;
  sasl?: {
    mechanism: 'plain' | 'scram-sha-256' | 'scram-sha-512';
    username: string;
    password: string;
  };
}

export enum KafkaTopics {
  PROFILE_UPDATED = 'profile.updated.v1',
}

export interface ProfileEvent {
  eventId: string;
  eventType: 'PROFILE_UPDATED' | 'PROFILE_CREATED';  // Use eventType in header, not separate topics
  timestamp: string;
  authId: string;
  profileId: string;
  changes: {
    field: string;
    oldValue?: any;
    newValue: any;
  }[];
  metadata: {
    source: 'profile-service';
    version: '1.0';
    correlationId: string;
  };
}

// Schema validation (optional, but recommended)
export const profileUpdatedSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['eventId', 'authId', 'profileId', 'changes'],
  properties: {
    eventId: { type: 'string', format: 'uuid' },
    authId: { type: 'string' },
    profileId: { type: 'string' },
    changes: {
      type: 'array',
      items: {
        type: 'object',
        required: ['field', 'newValue'],
        properties: {
          field: { type: 'string' },
          oldValue: {},
          newValue: {}
        }
      }
    }
  }
};
