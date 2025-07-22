import { Request, Response, NextFunction } from "express";
import { User, Workspace } from "../generated/prisma";
import { getWorkspaceByName, createWorkspace } from "../models/workspace.model";
import { getUserByEmail, createUser } from "../models/users.model";
import { httpCodes, userErrorsMsg, workspaceErrorsMsg } from "../utils/errorCodes.js";
import { AppError } from "../middleware/errorHandler.middleware";
import { hashPassword, comparePassword } from "../utils/auth.helper";
import { generateAccessToken, generateRefreshToken } from "../utils/auth.helper";
import { validationResult } from "express-validator";
import { SuccessResponse } from "../server.types";
import { omitFields } from "../utils/data.helper";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validation = validationResult(req);

    if (!validation.isEmpty()) {
      const error = new AppError("Validation failed", 400);
      error.name = "ValidationError";
      (error as any).errors = validation.array();
      throw error;
    } else {
      const { firstName, lastName, email, password, role, phone }: User = req.body.user;
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
          role,
          phone,
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
        const cookieName = process.env.COOKIE_NAME_FOR_TOKEN as string;

        // set refresh token in cookie
        res.cookie(cookieName, refreshToken, {
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
    const user = await getUserByEmail(req.body.email);
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
    const cookieName = process.env.COOKIE_NAME_FOR_TOKEN as string;
    res.clearCookie(cookieName);
    const successResponse: SuccessResponse = {
      success: true,
      message: "User logged out successfully",
    };
    res.status(httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    next(error);
  }
};
