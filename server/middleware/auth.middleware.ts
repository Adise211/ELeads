import { Request, Response, NextFunction } from "express";
import { hasPermission, verifyAccessToken } from "../lib/auth.helper.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { httpCodes, userErrorsMsg } from "../utils/errorCodes.js";
import { Permission } from "@prisma/client";

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  try {
    // Check for the Authorization header
    const authHeader = req.headers["authorization"];
    let token = authHeader?.split(" ")[1]; // Bearer <token>
    if (!token) {
      // Try to get token from cookies
      const accessTokenCookieName = process.env.COOKIE_ACCESS_TOKEN_NAME as string;
      token = req.cookies?.[accessTokenCookieName];
    }
    if (!token) {
      next(new AppError("No token provided", httpCodes.UNAUTHORIZED));
    } else {
      const user = verifyAccessToken(token);

      (req as any).user = user;
      next();
    }
  } catch (err) {
    next(new AppError("Invalid or expired token", httpCodes.FORBIDDEN));
  }
}

export function checkPermission(action: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { permissions } = (req as any).user;
    if (permissions.includes(action)) {
      next();
    } else {
      next(new AppError(userErrorsMsg.USER_NOT_AUTHORIZED, httpCodes.FORBIDDEN));
    }
  };
}
