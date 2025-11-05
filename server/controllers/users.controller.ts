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
import { RegisterUserFields, StytchUpdateUserParams, SuccessResponse } from "../server.types.js";
import { omitFields } from "../lib/data.helper.js";
import { stytchService } from "../services/stytch.service.js";
import cache from "../lib/node-cache.js";

const getCachedDataForRegisterUser = (cachedDataKey: string) => {
  try {
    const cachedData = cache.get(cachedDataKey);

    const { stytchSessionToken, stytchUserId } = cachedData as {
      stytchSessionToken: string;
      stytchUserId: string;
    };

    return { stytchSessionToken, stytchUserId };
  } catch (error) {
    console.error("[REGISTER USER] - Failed to get cached session token");

    throw new AppError(
      "Sorry, we could not signup you up. Please try again later.",
      consts.httpCodes.INTERNAL_SERVER_ERROR
    );
  }
};

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
      // 7. Register the user in Stytch - if feature flag is enabled
      if (consts.featureFlags.AUTH_BY_STYTCH) {
        const cachedData = getCachedDataForRegisterUser(email);
        const { stytchSessionToken, stytchUserId } = cachedData;

        const addPasswordByResetResponse = await stytchService.resetPasswordByExistingSession(
          stytchSessionToken,
          password
        );
        if (
          addPasswordByResetResponse &&
          (addPasswordByResetResponse as any)?.status_code === 200
        ) {
          console.log("[REGISTER USER] - Password added to Stytch successfully");
          const params: StytchUpdateUserParams = {
            dbUserId: createdUser.id,
            email: createdUser.email,
            name: { firstName: createdUser.firstName, lastName: createdUser.lastName },
            workspaceId: createdWorkspace.id,
            role: createdUser.role,
            permissions: createdUser.permissions,
          };
          const updateUserInStytchResponse = await stytchService.updateUserInfoInStytch(
            stytchUserId,
            params
          );
          if (
            updateUserInStytchResponse &&
            (updateUserInStytchResponse as any)?.status_code === 200
          ) {
            console.log("[REGISTER USER] - User info updated in Stytch successfully");
          } else {
            console.error("[REGISTER USER] - Failed to update user info in Stytch");
            throw new AppError(
              "Sorry, we could not signup you up. Please try again later.",
              consts.httpCodes.INTERNAL_SERVER_ERROR
            );
          }
        } else {
          console.error("[REGISTER USER] - Failed to add password to Stytch");
          throw new AppError(
            "Sorry, we could not signup you up. Please try again later.",
            consts.httpCodes.INTERNAL_SERVER_ERROR
          );
        }
      }
      console.log("----------------END OF REGISTER USER----------------");

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
    // 2. Authenticate user by password in Stytch - if feature flag is enabled
    if (consts.featureFlags.AUTH_BY_STYTCH) {
      const stytchResponse = await stytchService.authenticateUserByPasswordInStytch(
        email,
        password
      );
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
            secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging", // HTTPS only in production/staging
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
          }
        );

        // const isLoggedIn = await localFuncHelpers.loginUserWithStytch(email, password)(res);
        // if (!isLoggedIn) {
        //   throw new AppError(userErrorsMsg.USER_NOT_FOUND, consts.httpCodes.UNAUTHORIZED);
        // }

        // 4. Return the success response
        const successResponse: SuccessResponse = {
          success: true,
          message: "User logged in successfully",
          data: {},
        };
        console.log("[LOGIN USER] - user logged in successfully with Stytch!");
        res.status(consts.httpCodes.SUCCESS).json(successResponse);
      } else {
        // 5. If login is unsuccessful, throw an error
        console.log("[LOGIN USER] - user not found in Stytch, even after retry..");
        throw new AppError(userErrorsMsg.USER_NOT_FOUND, consts.httpCodes.UNAUTHORIZED);
      }
    } else {
      // 5. Authenticate user by password in DB - if feature flag is disabled
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
        secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging", // HTTPS only in production/staging
        sameSite: "lax",
        maxAge: 1 * 60 * 60 * 1000, // 1 hour in ms
      });

      // set refresh token in cookie
      res.cookie(refreshTokenCookieName, refreshToken, {
        httpOnly: true, // accessible only by the web server
        secure: process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging", // HTTPS only in production/staging
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
      });
      // console.log(
      //   `[LOGIN USER] - setting access token in cookie: ${accessTokenCookieName}: ${accessToken ? "present" : "missing"}, refresh token: ${refreshTokenCookieName}: ${refreshToken ? "present" : "missing"}`
      // );
      // console.log(
      //   `[LOGIN USER] - access token: ${req.cookies[accessTokenCookieName] ? "present" : "missing"}, refresh token: ${req.cookies[refreshTokenCookieName] ? "present" : "missing"}`
      // );

      // If login is successful
      const successResponse: SuccessResponse = {
        success: true,
        message: "User logged in successfully",
      };
      console.log("[LOGIN USER] - user logged in successfully with DB!");
      res.status(consts.httpCodes.SUCCESS).json(successResponse);
    }
    console.log("----------------END OF LOGIN USER----------------");
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
    if (consts.featureFlags.AUTH_BY_STYTCH) {
      const stytchCookieName = process.env.STYTCH_SESSION_TOKEN_NAME as string;
      const sessionToken = req.cookies[stytchCookieName];
      if (!sessionToken) {
        throw new AppError(userErrorsMsg.INVALID_USER_DATA, consts.httpCodes.NOT_FOUND);
      }
      // revoke or logout user from Stytch
      const stytchResponse = await stytchService.revokeOrLogoutUserFromStytch(sessionToken);
      if (stytchResponse && (stytchResponse as any)?.status_code === 200) {
        // clear session token cookie
        res.clearCookie(stytchCookieName, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        });

        const successResponse: SuccessResponse = {
          success: true,
          message: "User logged out successfully",
        };
        console.log("[LOGOUT USER] - user logged out successfully from Stytch");
        res.status(consts.httpCodes.SUCCESS).json(successResponse);
      } else {
        throw new AppError("Failed to logout user", consts.httpCodes.INTERNAL_SERVER_ERROR);
      }
    } else {
      const accessTokenCookieName = process.env.COOKIE_ACCESS_TOKEN_NAME as string;
      const refreshTokenCookieName = process.env.COOKIE_REFRESH_TOKEN_NAME as string;
      if (!accessTokenCookieName || !refreshTokenCookieName) {
        throw new AppError(userErrorsMsg.INVALID_USER_DATA, consts.httpCodes.NOT_FOUND);
      }
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
      console.log("[LOGOUT USER] - access token and refresh token cleared successfully from DB");

      const successResponse: SuccessResponse = {
        success: true,
        message: "User logged out successfully",
      };
      res.status(consts.httpCodes.SUCCESS).json(successResponse);
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

    // Reset password in Stytch after successful database update
    try {
      const stytchResetResponse = await stytchService.resetExistingUserPasswordInStytch({
        email: user.email,
        existingPassword: currentPassword,
        newPassword: newPassword,
      });

      if (stytchResetResponse && (stytchResetResponse as any)?.status_code === 200) {
        console.log("[CHANGE PASSWORD] - Password successfully updated in Stytch");
      } else {
        console.error(
          "[CHANGE PASSWORD] - Failed to update password in Stytch:",
          stytchResetResponse
        );
        // Note: We don't throw an error here as the database password was already updated successfully
        // The user can still use the new password, but may need to re-authenticate
      }
    } catch (stytchError) {
      console.error("[CHANGE PASSWORD] - Error updating password in Stytch:", stytchError);
      // Note: We don't throw an error here as the database password was already updated successfully
      // The user can still use the new password, but may need to re-authenticate
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

export const sendOTPToUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    // 1. Check if email exists
    const isEmailExists = await getUserByEmail(email);
    if (isEmailExists) {
      throw new AppError(userErrorsMsg.USER_ALREADY_EXISTS, consts.httpCodes.BAD_REQUEST);
    }
    // 2. Send OTP to user
    const stytchResponse = await stytchService.sendOTPToUserViaEmail(email);
    if (stytchResponse && (stytchResponse as any)?.status_code === 200) {
      // 3. Cache the OTP info
      const cachedOTPInfo = {
        stytchUserId: (stytchResponse as any)?.user_id,
        stytchMethodId: (stytchResponse as any)?.email_id,
      };
      const isCached = cache.set(email, cachedOTPInfo, 60 * 5); // 5 minutes
      console.log("[SEND OTP TO USER] - OTP cached successfully? ", isCached);
      if (!isCached) {
        throw new AppError("Failed to cache OTP", consts.httpCodes.INTERNAL_SERVER_ERROR);
      }

      // 4. Return the success response
      const successResponse: SuccessResponse = {
        success: true,
        message: "OTP sent successfully",
        data: {},
      };
      res.status(consts.httpCodes.SUCCESS).json(successResponse);
    } else {
      throw new AppError("Failed to send OTP", consts.httpCodes.INTERNAL_SERVER_ERROR);
    }
  } catch (error) {
    next(error);
  }
};

export const verifyOTPCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    const cachedOTPInfo = cache.get(email);
    if (!cachedOTPInfo) {
      throw new AppError("OTP not found", consts.httpCodes.NOT_FOUND);
    }
    const { stytchMethodId } = cachedOTPInfo as {
      stytchMethodId: string;
    };
    const stytchResponse = await stytchService.verifyOTPCode(stytchMethodId, otp);
    if (stytchResponse && (stytchResponse as any)?.status_code === 200) {
      console.log("[VERIFY OTP CODE] - OTP verified successfully");
      const cachedOTPInfo: Record<string, any> | undefined = cache.get(email);
      if (cachedOTPInfo) {
        cachedOTPInfo.stytchSessionToken = (stytchResponse as any)?.session_token;
        const isCached = cache.set(email, cachedOTPInfo, 60 * 5); // 5 minutes
        console.log("[VERIFY OTP CODE] - OTPsession token cached successfully? ", isCached);
        if (!isCached) {
          throw new AppError("Failed to verify OTP", consts.httpCodes.INTERNAL_SERVER_ERROR);
        }
      }
      const successResponse: SuccessResponse = {
        success: true,
        message: "OTP verified successfully",
        data: {},
      };
      res.status(consts.httpCodes.SUCCESS).json(successResponse);
    } else {
      throw new AppError("Failed to verify OTP", consts.httpCodes.INTERNAL_SERVER_ERROR);
    }
  } catch (error) {
    next(error);
  }
};

export const testCachedOTP = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const cachedData = cache.get(email);
    console.log("[TEST CACHED OTP] - Cached data: ", cachedData);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Test cached OTP successfully",
      data: cachedData,
    };
    res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    next(error);
  }
};
