import { Request, Response, NextFunction } from "express";
import { hasPermission, verifyAccessToken } from "../lib/auth.helper.js";
import { stytchService } from "../services/stytch.service.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { httpCodes, userErrorsMsg } from "../utils/errorCodes.js";
import { Permission } from "@prisma/client";

// New Stytch session authentication function
export async function authenticateStytchSession(req: Request, res: Response, next: NextFunction) {
  try {
    // Check for the Authorization header
    const authHeader = req.headers["authorization"];
    let sessionToken = authHeader?.split(" ")[1]; // Bearer <token>

    if (!sessionToken) {
      // Try to get session token from cookies
      const sessionTokenCookieName = process.env.STYTCH_SESSION_TOKEN_NAME as string;
      sessionToken = req.cookies?.[sessionTokenCookieName];
    }

    if (!sessionToken) {
      console.log("[AUTH MIDDLEWARE] No session token provided");
      next(new AppError("Unauthorized", httpCodes.UNAUTHORIZED));
      return;
    }

    // Authenticate the session with Stytch
    const sessionResponse = await stytchService.verifyStytchSession(sessionToken);

    if (sessionResponse && sessionResponse.status_code === 200) {
      if (!sessionResponse.user.trusted_metadata) {
        console.log("[AUTH MIDDLEWARE] No trusted metadata provided");
        res.status(httpCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: "Internal server error",
          data: null,
        });
        return;
      }
      // Extract user information from the Stytch session response
      const user = {
        userId: sessionResponse.user.trusted_metadata.dbUserId,
        email: sessionResponse.user.trusted_metadata.dbUserEmail,
        sessionId: sessionResponse.session.session_id,
        workspaceId: sessionResponse.user.trusted_metadata.dbWorkspaceId,
        permissions: sessionResponse.user.trusted_metadata.dbUserPermissions,
        // Add any other user data you need from the Stytch response
        // You might want to map Stytch user data to your application's user structure
      };

      (req as any).user = user;
      next();
    } else {
      console.log("[AUTH MIDDLEWARE] Invalid session token");
      next(new AppError("Unauthorized", httpCodes.FORBIDDEN));
    }
  } catch (err) {
    console.log("[AUTH MIDDLEWARE] Invalid or expired session token");
    next(new AppError("Unauthorized", httpCodes.FORBIDDEN));
  }
}

// Note: Old authenticateStytchToken function removed - replaced with authenticateStytchSession

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

// Commented out the original JWT-based authentication function
// export function authenticateToken(req: Request, res: Response, next: NextFunction) {
//   try {
//     // Check for the Authorization header
//     const authHeader = req.headers["authorization"];
//     let token = authHeader?.split(" ")[1]; // Bearer <token>
//     if (!token) {
//       // Try to get token from cookies
//       const accessTokenCookieName = process.env.COOKIE_ACCESS_TOKEN_NAME as string;
//       token = req.cookies?.[accessTokenCookieName];
//     }
//     if (!token) {
//       console.log("[AUTH MIDDLEWARE] No token provided");
//       next(new AppError("Unauthorized", httpCodes.UNAUTHORIZED));
//     } else {
//       const user = verifyAccessToken(token);

//       (req as any).user = user;
//       next();
//     }
//   } catch (err) {
//     console.log("[AUTH MIDDLEWARE] Invalid or expired token");
//     next(new AppError("Unauthorized", httpCodes.FORBIDDEN));
//   }
// }
