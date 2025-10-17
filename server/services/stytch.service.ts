import { consts } from "@eleads/shared";
import { loadStytch } from "../lib/loadStytch.js";
import { AppError } from "../middleware/errorHandler.middleware.js";

const stytchClient = loadStytch();

interface StytchErrorResponse {
  status_code: number;
  request_id: string;
  error_type?: string;
  error_message?: string;
  error_url?: string;
  error_details?: string | undefined;
}

function newStytchError(stytchError: StytchErrorResponse) {
  return new AppError(
    stytchError.error_message || "Stytch authentication failed",
    stytchError.status_code >= 400 && stytchError.status_code < 500
      ? stytchError.status_code
      : consts.httpCodes.INTERNAL_SERVER_ERROR
  );
}

/**
 *
 * @param data - The data to migrate the password to Stytch
 * @param data.email - The email of the user
 * @param data.phone - The phone number of the user
 * @param data.userId - The ID of the user
 * @param data.workspaceId - The ID of the workspace
 * @param data.role - The role of the user
 * @param data.isEmailVerified - Whether the email is verified
 * @param data.isPhoneVerified - Whether the phone number is verified
 * @param hashedPassword
 * @returns The response from the Stytch API
 */
const migratePasswordToStytch = async (data: Record<string, any>, hashedPassword: string) => {
  try {
    if (!data.email || !hashedPassword) {
      return {
        error: true,
        message: "Missing required fields: email or hashedPassword",
      };
    }
    const params = {
      email: data.email, // Required
      hash: hashedPassword, // Required
      hash_type: "bcrypt",
      phone_number: data.phone || "",
      external_id: data.userId || "",
      trusted_metadata: {
        dbWorkspaceId: data.workspaceId || "",
        dbUserId: data.userId || "",
      },
      roles: data.role ? [data.role] : [],
      set_email_verified: data.isEmailVerified || false,
      set_phone_number_verified: data.isPhoneVerified || false,
    };

    const response = await stytchClient.passwords.migrate(params);
    return response;
  } catch (error) {
    console.error("Error migrating password to Stytch: ", error);
    // throw error;
  }
};

/**
 *
 * @param password - The password to check the strength of
 * @returns The response from the Stytch API
 */
const checkPasswordStrength = async (password: string) => {
  try {
    const response = await stytchClient.passwords.strengthCheck({ password });
    return response;
  } catch (error) {
    console.error("Error checking password strength: ", error);
  }
};

/**
 *
 * @param data - The data to create a user in Stytch
 * @param data.email - The email of the user
 * @param data.password - The password of the user
 * @param data.sessionDurationMin - The duration of the session in minutes
 * @returns The response from the Stytch API
 */
const createUserInStytch = async (data: {
  email: string;
  password: string;
  sessionDurationMin: number;
}) => {
  try {
    console.log("[CREATE USER IN STYTCH] - creating user in Stytch...");
    // Validate input data - return error if missing required fields
    if (!data.email || !data.password || !data.sessionDurationMin) {
      return {
        error: true,
        message: "Missing required fields: email, password or sessionDurationMin",
      };
    }
    const params = {
      email: data.email,
      password: data.password,
      session_duration_minutes: data.sessionDurationMin,
    };
    const response = await stytchClient.passwords.create(params);

    return response;
  } catch (error) {
    console.error("Error creating user in Stytch: ", error);
    // Handle Stytch-specific errors
    // if (error && typeof error === "object" && "status_code" in error) {
    //   const stytchError = error as StytchErrorResponse;
    //   throw newStytchError(stytchError);
    // }
    // throw error;
  }
};

export const stytchService = {
  migratePasswordToStytch,
  checkPasswordStrength,
  createUserInStytch,
};
