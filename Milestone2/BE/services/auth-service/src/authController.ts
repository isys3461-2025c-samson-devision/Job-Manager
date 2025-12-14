import { asyncHandler } from "../../../shared/middleware";
import { AuthService } from "./authService";
import { createErrorResponse, createSuccessResponse } from "../../../shared/utils";
import { Request, Response } from "express";

const authService = new AuthService();
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await authService.register(email, password);

  res
    .cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(201)
    .json(createSuccessResponse({ accessToken: tokens.accessToken }, "User registered successfully"));
});


export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await authService.login(email, password);

  res
    .cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .status(200)
    .json(createSuccessResponse({ accessToken: tokens.accessToken,userId: tokens.userId }, "User logged in successfully"));
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    // Ưu tiên lấy refreshToken từ cookie, fallback body
    const cookieRefresh = req.cookies?.refreshToken;
    const bodyRefresh = req.body?.refreshToken;
    const incomingRefreshToken = cookieRefresh || bodyRefresh;
    if (!incomingRefreshToken) {
      return res
        .status(400)
        .json(createErrorResponse("Missing refresh token"));
    }
    const tokens = await authService.refreshtoken(incomingRefreshToken);
    // Set refreshToken vào httpOnly cookie
    res
      .cookie("refreshToken", tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // chỉ bật secure ở production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      })
      .status(200)
      .json(createSuccessResponse({ accessToken: tokens.accessToken }, "Token refreshed successfully"));
  }
);

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const cookieRefresh = req.cookies?.refreshToken;
  const bodyRefresh = req.body?.refreshToken;
  const incomingRefreshToken = cookieRefresh || bodyRefresh;

  if (!incomingRefreshToken) {
    // still clear cookie to logout client-side
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res
      .status(200)
      .json(createSuccessResponse(null, "User logged out successfully"));
  }
  await authService.logout(incomingRefreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res.status(200).json(createSuccessResponse(null, "User logged out successfully"));
});

export const validateToken = asyncHandler(
  async (req: Request, res: Response) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json(createErrorResponse("No Token Provided"));
    }
    const payload = await authService.validateToken(token);
  return  res.status(200).json(createSuccessResponse(payload, "Token is valid"));
}
);

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json(createErrorResponse("Unauthorized"));
    }
    const user = await authService.getUserById(userId);
    
    if (!user) {
        return res.status(404).json(createErrorResponse("User not found"));
    }
    return res.status(200).json(createSuccessResponse(user, "User profile retrieved successfully"));
});

export const deleteAccount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json(createErrorResponse("Unauthorized"));
    }
    await authService.deleteUser(userId);
    return res.status(200).json(createSuccessResponse(null, "User account deleted successfully"));
});
