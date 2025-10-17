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
// import { generateAccessToken, generateRefreshToken } from "../lib/auth.helper.js";
import { RegisterUserFields, StytchCreatUserParams, SuccessResponse } from "../server.types.js";
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

      console.log("----------------END REGISTER USER----------------");

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
    console.log("[LOGIN USER] - login user request received");
    const { email, password } = req.body;
    // 1. Check if user exists
    const user: User | null = await getUserByEmail(email);
    if (!user) {
      throw new AppError(userErrorsMsg.USER_NOT_FOUND, consts.httpCodes.UNAUTHORIZED);
    }
    console.log("[LOGIN USER] - user found in DB");

    // 2. Login or cretae user in Stytch (user is exists in the DB)
    const stytchData: StytchCreatUserParams = {
      email,
      password,
      name: {
        first_name: user.firstName,
        last_name: user.lastName,
      },
      trusted_metadata: {
        dbUserId: user.id || "",
        dbUserEmail: user.email || "",
        dbWorkspaceId: user.workspaceId || "",
        dbUserRole: user.role ? [user.role] : [],
        dbUserPermissions: user.permissions || [],
      },
      sessionDurationMin: 60, // in minutes (1 hour)
    };

    const stytchResponse = await stytchService.loginUserInStytch(stytchData);

    if (
      stytchResponse &&
      (stytchResponse as any)?.status_code === 200 &&
      (stytchResponse as any)?.session_token
    ) {
      // 3. If login is successful set the session token in a cookie
      console.log("[LOGIN USER] - user found in Stytch, logging in user...");
      res.cookie(
        process.env.STYTCH_SESSION_TOKEN_NAME as string,
        (stytchResponse as any)?.session_token,
        {
          httpOnly: true, // accessible only by the web server
          secure: process.env.NODE_ENV === "production", // HTTPS only in production
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        }
      );

      // 4. Return the success response
      const successResponse: SuccessResponse = {
        success: true,
        message: "User logged in successfully",
        data: {},
      };
      console.log("[LOGIN USER] - user logged in successfully!");
      res.status(consts.httpCodes.SUCCESS).json(successResponse);
    } else {
      // 5. If login is unsuccessful, throw an error
      console.log("[LOGIN USER] - user not found in Stytch, even after retry..");
      throw new AppError(userErrorsMsg.USER_NOT_FOUND, consts.httpCodes.UNAUTHORIZED);
    }
    console.log("----------------END LOGIN USER----------------");
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
    const sessionTokenCookieName = process.env.STYTCH_SESSION_TOKEN_NAME as string;
    const sessionToken = req.cookies[sessionTokenCookieName];
    if (!sessionToken) {
      throw new AppError(userErrorsMsg.INVALID_USER_DATA, consts.httpCodes.NOT_FOUND);
    }

    // revoke or logout user from Stytch
    const stytchResponse = await stytchService.revokeOrLogoutUserFromStytch(sessionToken);
    if (stytchResponse && (stytchResponse as any)?.status_code === 200) {
      // clear session token cookie
      res.clearCookie(sessionTokenCookieName, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });

      const successResponse: SuccessResponse = {
        success: true,
        message: "User logged out successfully",
      };
      console.log("[LOGOUT USER] - user logged out successfully");
      res.status(consts.httpCodes.SUCCESS).json(successResponse);
    } else {
      throw new AppError("Failed to logout user", consts.httpCodes.INTERNAL_SERVER_ERROR);
    }
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
