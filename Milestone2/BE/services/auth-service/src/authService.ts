import { AuthTokens } from "../../../shared/types";
import { ServiceError } from "../../../shared/types";
import prisma from "./database";
import { createServiceError } from "../../../shared/utils";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

export class AuthService {
  private readonly jwtSecret: string;
  private readonly jwtRefreshSecret: string;
  private readonly jwtExpiresIn: string | number;
  private readonly jwtRefeshExpiresIn: string | number;
  private readonly bcryptRounds: number;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET!;
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET!;
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "15m";
    this.jwtRefeshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";
    this.bcryptRounds = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);

    if (!this.jwtSecret || !this.jwtRefreshSecret) {
      throw new Error("JWT secrets must be defined in environment variables");
    }
  }
  async register(email: string, password: string): Promise<AuthTokens> {
    // check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw createServiceError("User already exists", 409);
    }

    // hash the password
    const hashedPassword = await bcrypt.hash(password, this.bcryptRounds);

    // create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role:"APPLICANT",
      },
    });

    // generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);
    return tokens;
  }

  async login(email: string, password: string): Promise<AuthTokens> {
    //find the user
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      throw createServiceError("Invalid email or password", 401);
    }

    //verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw createServiceError("Invalid email or password", 401);
    }

    //generate tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return tokens;
  }
  

  async refreshtoken(refreshToken: string): Promise<AuthTokens> {
    try {
      //verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        this.jwtRefreshSecret
      ) as JwtPayload;

      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
      });
      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw createServiceError("Invalid or expired refresh token", 401);
      }

      const tokens = await this.generateTokens(
        storedToken.userId,
        storedToken.user.email,
        storedToken.user.role
      );

      await prisma.refreshToken.delete({
        where: { id: storedToken.id },
      });

      return tokens;
    } catch (error) {
      if (error instanceof ServiceError) {
        throw error;
      }
      throw createServiceError("Invalid or expired refresh token", 401, error);
    }
  }
  async logout(refreshToken: string): Promise<void> {
    //delete the refresh token from database
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  async validateToken(token: string): Promise<JwtPayload> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as JwtPayload;

      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        throw createServiceError("Invalid token: user not found", 401);
      }
      return decoded;
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw createServiceError("Invalid token", 401);
      }
      throw createServiceError("Invalid or expired token", 401, error);
    }
  }

  //generate tokens
  private async generateTokens(
    userId: string,
    email: string,
    role: string
  ): Promise<AuthTokens> {
    const payload = { userId, email, role };

    // Generate access token
    const accessTokenOptions: SignOptions = {
      expiresIn: this.jwtExpiresIn as SignOptions["expiresIn"],
    };

    const accessToken = jwt.sign(
      payload,
      this.jwtSecret,
      accessTokenOptions
    ) as string;

    // Generate refresh token
    const refreshTokenOptions: SignOptions = {
      expiresIn: this.jwtRefeshExpiresIn as SignOptions["expiresIn"],
    };
    const refreshToken = jwt.sign(
      payload,
      this.jwtRefreshSecret,
      refreshTokenOptions
    ) as string;

    // Store refresh token in the database
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

    await prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw createServiceError("User not found", 404);
    }
    return user;
  }
  async deleteUser(userId: string): Promise<void> {
    await prisma.user.delete({
      where: { id: userId },
    });
  }
}
