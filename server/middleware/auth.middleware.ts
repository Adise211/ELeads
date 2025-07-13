import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/auth.helper.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { httpCodes } from "../utils/errorCodes.js";

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Check for the Authorization header
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1]; // Bearer <token>

    if (!token) {
      next(new AppError("No token provided", httpCodes.UNAUTHORIZED));
    } else {
      const user = verifyAccessToken(token);
      (req as any).user = user; // attach user to request
      next();
    }
  } catch (err) {
    next(new AppError("Invalid or expired token", httpCodes.FORBIDDEN));
  }
}
