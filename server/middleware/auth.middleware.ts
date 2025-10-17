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
      console.log("[AUTH MIDDLEWARE] No token provided");
      next(new AppError("Unauthorized", httpCodes.UNAUTHORIZED));
    } else {
      const user = verifyAccessToken(token);

      (req as any).user = user;
      next();
    }
  } catch (err) {
    console.log("[AUTH MIDDLEWARE] Invalid or expired token");
    next(new AppError("Unauthorized", httpCodes.FORBIDDEN));
  }
}

// export function authenticateStytchToken(req: Request, res: Response, next: NextFunction) {
//   try {
//     // Check for the Authorization header
//     const authHeader = req.headers["authorization"];
//     let token = authHeader?.split(" ")[1]; // Bearer <token>
//     if (!token) {
//       // Try to get token from cookies
//       const accessTokenCookieName = process.env.STYTCH_SESSION_TOKEN_NAME as string;
//       token = req.cookies?.[accessTokenCookieName];
//     }
//     if (!token) {
//       console.log("[AUTH MIDDLEWARE] No token provided");
//       next(new AppError("Unauthorized", httpCodes.UNAUTHORIZED));
//     } else {
//       const user = verifyStytchSessionToken(token);
//       (req as any).user = user;
//       next();
//     }
//   } catch (err) {
//     console.log("[AUTH MIDDLEWARE] Invalid or expired token");
//     next(new AppError("Unauthorized", httpCodes.FORBIDDEN));
//   }
// }

export function checkPermission(action: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { permissions, userId } = (req as any).user;
    const dataAssignedToId = (req as any).body?.assignedToId || req.query?.assignedToId || null;
    // check if the user is the owner of the data
    if (dataAssignedToId && dataAssignedToId === userId) {
      console.log("user is owner!");
      next();
    } else if (permissions.includes(action)) {
      // check if the user has the permission to access the data that he does not own
      console.log("user has permission!");
      next();
    } else {
      console.log("user is not owner and does not have permission!");
      next(new AppError(userErrorsMsg.USER_NOT_AUTHORIZED, httpCodes.FORBIDDEN));
    }
  };
}
