import { Request, Response, NextFunction } from "express";
import { User, Workspace, UserRole } from "@prisma/client";
import { consts } from "@eleads/shared";
import {
  createWorkspace,
  getWorkspaceById,
  addUserToWorkspace,
} from "../models/workspace.model.js";
import {
  getUserByEmail,
  createUser,
  changeUserPassword as changePassword,
  updateUserInfo as updateUserInfoModel,
} from "../models/users.model.js";
import { userErrorsMsg, workspaceErrorsMsg } from "../utils/errorCodes.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { hashPassword, comparePassword, rolePermissionMap } from "../lib/auth.helper.js";
import { generateAccessToken, generateRefreshToken } from "../lib/auth.helper.js";
import { RegisterUserFields, SuccessResponse } from "../server.types.js";
import { omitFields } from "../lib/data.helper.js";
import { stytchService } from "../services/stytch.service.js";

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { user, workspace }: RegisterUserFields = req.body;
    const { firstName, lastName, email, password, phone } = user;
    let createdUser: User | null = null;
    let createdWorkspace: Workspace | null = null;
    // Default user role is admin
    // TODO: make this dynamic based on the workspace (new -> admin, existing -> by link)
    let userRole: UserRole = UserRole.ADMIN;

    // 1. Check if password is strong enough
    const passwordStrength = await stytchService.checkPasswordStrength(password);
    if (!passwordStrength || !passwordStrength.valid_password) {
      console.error("[REGISTER USER] password strength check failed: ", passwordStrength);
      throw new AppError(userErrorsMsg.PASSWORD_WEAK, consts.httpCodes.BAD_REQUEST);
    }

    // 2. Hash password
    const hashedPassword = await hashPassword(password);
    const isUserExisting = await getUserByEmail(email);

    if (isUserExisting) {
      // 3. Check if user already exists
      res.status(consts.httpCodes.BAD_REQUEST).json({ message: userErrorsMsg.USER_ALREADY_EXISTS });
    } else {
      // 4. Create a new workspace
      if (workspace.name) {
        const workspaceName = workspace.name || `${firstName}'s Workspace`;
        createdWorkspace = await createWorkspace(workspaceName);
      } else if (workspace.id) {
        createdWorkspace = await getWorkspaceById(workspace.id);
      } else {
        throw new AppError(workspaceErrorsMsg.WORKSPACE_NOT_FOUND, consts.httpCodes.BAD_REQUEST);
      }

      if (!createdWorkspace) {
        throw new AppError(
          workspaceErrorsMsg.FAILED_TO_CREATE_WORKSPACE,
          consts.httpCodes.INTERNAL_SERVER_ERROR
        );
      }
      // 5. Create a new user
      createdUser = await createUser({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        role: userRole,
        phone,
        permissions: rolePermissionMap[userRole],
      });

      if (!createdUser) {
        throw new AppError(
          userErrorsMsg.FAILED_TO_CREATE_USER,
          consts.httpCodes.INTERNAL_SERVER_ERROR
        );
      }
      // 6. Add the user to the workspace
      await addUserToWorkspace(createdWorkspace.id, createdUser.id);
      console.log("[REGISTER USER] - user was created in DB!");

      // 7. Create a user in Stytch and set session token in cookie
      const stytchResponse = await stytchService.createUserInStytch({
        email,
        password,
        sessionDurationMin: 60, // in minutes (1 hour)
      });

      if (
        stytchResponse &&
        (stytchResponse as any)?.status_code === 200 &&
        (stytchResponse as any)?.session_token
      ) {
        res.cookie(
          process.env.COOKIE_STYTCH_SESSION_TOKEN_NAME as string,
          (stytchResponse as any)?.session_token,
          {
            httpOnly: true, // accessible only by the web server
            secure: process.env.NODE_ENV === "production", // HTTPS only in production
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
          }
        );
        console.log("[REGISTER USER] - user was created in Stytch!");
      } else {
        // Continue with the registration process even if createUserInStytch fails
        console.error("[REGISTER USER] createUserInStytch failed: ", stytchResponse);
      }
      console.log("--------------------------------");

      // 8. Return the created user and workspace
      res.status(consts.httpCodes.CREATED).json({
        success: true,
        message: "User registered successfully",
        data: {},
      });
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
      throw new AppError(userErrorsMsg.USER_NOT_FOUND, consts.httpCodes.UNAUTHORIZED);
    } else {
      // Compare passwords
      const isPasswordCorrect = await comparePassword(password, user.password);
      if (!isPasswordCorrect) {
        throw new AppError(userErrorsMsg.INCORRECT_PASSWORD, consts.httpCodes.UNAUTHORIZED);
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
      res.status(consts.httpCodes.SUCCESS).json(successResponse);
    }
  } catch (error) {
    next(error);
  }
};

export const getAuthenticatedUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await getUserByEmail((req as any).user.email);
    if (!user) {
      throw new AppError(userErrorsMsg.USER_NOT_FOUND, consts.httpCodes.NOT_FOUND);
    } else {
      const safeUser = omitFields(user, ["password"]);
      const successResponse: SuccessResponse = {
        success: true,
        message: "User fetched successfully",
        data: { user: safeUser },
      };
      res.status(consts.httpCodes.SUCCESS).json(successResponse);
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
    res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    next(error);
  }
};

export const changeUserPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await getUserByEmail((req as any).user.email);
    if (!user) {
      throw new AppError(userErrorsMsg.USER_NOT_FOUND, consts.httpCodes.NOT_FOUND);
    }

    // Verify old password
    const isPasswordCorrect = await comparePassword(currentPassword, user.password);
    if (!isPasswordCorrect) {
      throw new AppError(userErrorsMsg.INCORRECT_PASSWORD, consts.httpCodes.UNAUTHORIZED);
    }
    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);
    // Change password
    const updatedUser = await changePassword(user.id, hashedNewPassword);
    if (!updatedUser) {
      throw new AppError(userErrorsMsg.USER_NOT_FOUND, consts.httpCodes.NOT_FOUND);
    }

    const successResponse: SuccessResponse = {
      success: true,
      message: "Password changed successfully",
      data: {},
    };

    res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    next(error);
  }
};

export const updateUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, phone } = req.body;
    const user = await getUserByEmail((req as any).user.email);
    if (!user) {
      throw new AppError(userErrorsMsg.USER_NOT_FOUND, consts.httpCodes.NOT_FOUND);
    }
    const updatedUser = await updateUserInfoModel(user.id, { firstName, lastName, email, phone });
    // Omit password from the response
    const safeUser = omitFields(updatedUser, ["password"]);
    const successResponse: SuccessResponse = {
      success: true,
      message: "User info updated successfully",
      data: safeUser,
    };
    res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    next(error);
  }
};
