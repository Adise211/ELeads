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
      const reqAction: Permission | undefined | null = req.body?.action || null;
      const requiredPermission = !!reqAction;

      if (requiredPermission) {
        // Check if user has permission to perform the action
        const isUserHasPermission = hasPermission(user, reqAction);
        // If user does not have permission, return 403 Forbidden
        if (!isUserHasPermission) {
          next(new AppError(userErrorsMsg.USER_NOT_AUTHORIZED, httpCodes.FORBIDDEN));
        } else {
          // user has permission, attach the user to the request
          (req as any).user = user;
          next();
        }
      } else {
        // no permission required, attach the user to the request
        (req as any).user = user;
        next();
      }
    }
  } catch (err) {
    console.log("FFF", err);
    next(new AppError("Invalid or expired token", httpCodes.FORBIDDEN));
  }
}
