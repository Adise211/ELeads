import { Request, Response, NextFunction } from "express";
import { User, Workspace } from "../generated/prisma";
import { getWorkspaceByName, createWorkspace } from "../models/workspace.model";
import { getUserByEmail, createUser } from "../models/users.model";
import { httpCodes, userErrorsMsg, workspaceErrorsMsg } from "../utils/errorCodes.js";
import { AppError } from "../middleware/errorHandler.middleware";
import { hashPassword, comparePassword, rolePermissionMap } from "../lib/auth.helper";
import { generateAccessToken, generateRefreshToken } from "../lib/auth.helper";
import { validationResult } from "express-validator";
import { SuccessResponse } from "../server.types";
import { omitFields } from "../lib/data.helper";
import { UserRole } from "@prisma/client";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validationResult(req);

    if (!validation.isEmpty()) {
      const error = new AppError("Validation failed", 400);
      error.name = "ValidationError";
      (error as any).errors = validation.array();
      throw error;
    } else {
      const { firstName, lastName, email, password, phone }: User = req.body.user;
      const { name }: Workspace = req.body.workspace;
      const hashedPassword = await hashPassword(password);
      let _workspaceName = name.toLocaleLowerCase();

      const isWorkspaceExisting = await getWorkspaceByName(_workspaceName);
      const isUserExisting = await getUserByEmail(email);
      // Check if workspace or user already exists
      if (isWorkspaceExisting) {
        res
          .status(httpCodes.BAD_REQUEST)
          .json({ message: workspaceErrorsMsg.WORKSPACE_ALREADY_EXISTS });
      } else if (isUserExisting) {
        res.status(httpCodes.BAD_REQUEST).json({ message: userErrorsMsg.USER_ALREADY_EXISTS });
      } else {
        // If workspace and user do not exist, create a new user and workspace
        const user = await createUser({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          role: UserRole.ADMIN,
          phone,
          permissions: rolePermissionMap[UserRole.ADMIN],
        });
        // If user is created successfully, create a workspace for the user
        if (user) {
          const workspace = await createWorkspace(_workspaceName, user.id);
          res.status(httpCodes.CREATED).json({
            success: true,
            message: "User registered successfully",
            data: { user, workspace },
          });
        } else {
          throw new AppError(userErrorsMsg.INVALID_USER_DATA, httpCodes.INTERNAL_SERVER_ERROR);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validationResult(req);

    if (!validation.isEmpty()) {
      const error = new AppError("Validation failed", 400);
      error.name = "ValidationError";
      (error as any).errors = validation.array();
      throw error;
    } else {
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
          email: user.email,
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
