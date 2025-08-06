import { Request, Response, NextFunction } from "express";
import { User, Workspace } from "@prisma/client";
import {
  createWorkspace,
  getWorkspaceById,
  addUserToWorkspace,
} from "../models/workspace.model.js";
import { getUserByEmail, createUser } from "../models/users.model.js";
import { httpCodes } from "@eleads/shared";
import { userErrorsMsg, workspaceErrorsMsg } from "../utils/errorCodes.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { hashPassword, comparePassword, rolePermissionMap } from "../lib/auth.helper.js";
import { generateAccessToken, generateRefreshToken } from "../lib/auth.helper.js";
import { RegisterUserFields, SuccessResponse } from "../server.types.js";
import { omitFields } from "../lib/data.helper.js";
import { UserRole } from "@prisma/client";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, workspace }: RegisterUserFields = req.body;
    const { firstName, lastName, email, password, phone } = user;
    let createdUser: User | null = null;
    let createdWorkspace: Workspace | null = null;
    // Default user role is admin
    // TODO: make this dynamic based on the workspace (new -> admin, existing -> by link)
    let userRole: UserRole = UserRole.ADMIN;

    const hashedPassword = await hashPassword(password);
    const isUserExisting = await getUserByEmail(email);

    if (isUserExisting) {
      // If user already exists, return an error
      res.status(httpCodes.BAD_REQUEST).json({ message: userErrorsMsg.USER_ALREADY_EXISTS });
    } else {
      // Create a new workspace
      if (workspace.name) {
        const workspaceName = workspace.name || `${firstName}'s Workspace`;
        createdWorkspace = await createWorkspace(workspaceName);
      } else if (workspace.id) {
        createdWorkspace = await getWorkspaceById(workspace.id);
      } else {
        throw new AppError(workspaceErrorsMsg.WORKSPACE_NOT_FOUND, httpCodes.BAD_REQUEST);
      }

      // Create a new user
      if (createdWorkspace) {
        createdUser = await createUser({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: userRole,
          phone,
          permissions: rolePermissionMap[userRole],
        });
        if (createdUser) {
          // Add the user to the workspace
          await addUserToWorkspace(createdWorkspace.id, createdUser.id);
        }
        // Return the created user and workspace
        res.status(httpCodes.CREATED).json({
          success: true,
          message: "User registered successfully",
          data: {},
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user: User | null = await getUserByEmail(email);
    if (!user) {
      throw new AppError(userErrorsMsg.USER_NOT_FOUND, httpCodes.UNAUTHORIZED);
    } else {
      // Compare passwords
      const isPasswordCorrect = await comparePassword(password, user.password);
      if (!isPasswordCorrect) {
        throw new AppError(userErrorsMsg.INCORRECT_PASSWORD, httpCodes.UNAUTHORIZED);
      }

      // If password is correct, create a payload with user data
      const payload = {
        userId: user.id,
        workspaceId: user.workspaceId,
        email: user.email,
        permissions: user.permissions,
      };
      // Generate access and refresh tokens
      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      const accessTokenCookieName = process.env.COOKIE_ACCESS_TOKEN_NAME as string;
      const refreshTokenCookieName = process.env.COOKIE_REFRESH_TOKEN_NAME as string;

      // set access token in cookie
      res.cookie(accessTokenCookieName, accessToken, {
        httpOnly: true, // accessible only by the web server
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "strict",
        maxAge: 1 * 60 * 60 * 1000, // 1 hour in ms
      });

      // set refresh token in cookie
      res.cookie(refreshTokenCookieName, refreshToken, {
        httpOnly: true, // accessible only by the web server
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      });

      // If login is successful
      const successResponse: SuccessResponse = {
        success: true,
        message: "User logged in successfully",
      };
      res.status(httpCodes.SUCCESS).json(successResponse);
    }
  } catch (error) {
    next(error);
  }
};

export const getAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserByEmail((req as any).user.email);
    if (!user) {
      throw new AppError(userErrorsMsg.USER_NOT_FOUND, httpCodes.NOT_FOUND);
    } else {
      const safeUser = omitFields(user, ["password"]);
      res.status(httpCodes.SUCCESS).json({ user: safeUser });
    }
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accessTokenCookieName = process.env.COOKIE_ACCESS_TOKEN_NAME as string;
    const refreshTokenCookieName = process.env.COOKIE_REFRESH_TOKEN_NAME as string;

    // clear access token cookie
    res.clearCookie(accessTokenCookieName, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });
    // clear refresh token cookie
    res.clearCookie(refreshTokenCookieName, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    const successResponse: SuccessResponse = {
      success: true,
      message: "User logged out successfully",
    };
    res.status(httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    next(error);
  }
};
