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
 * @param data.name - The name of the user
 * @param data.name.first_name - The first name of the user
 * @param data.name.last_name - The last name of the user
 * @param data.trusted_metadata - The trusted metadata of the user
 * @param data.trusted_metadata.dbWorkspaceId - The ID of the workspace
 * @param data.trusted_metadata.dbUserId - The ID of the user
 * @param data.sessionDurationMin - The duration of the session in minutes
 * @returns The response from the Stytch API
 */
const createUserInStytch = async (data: {
  email: string;
  password: string;
  name?: {
    first_name?: string;
    last_name?: string;
  };
  trusted_metadata?: {
    dbWorkspaceId?: string;
    dbUserId?: string;
  };
  sessionDurationMin: number;
}) => {
  try {
    console.log("[STYTCH SERVICE - CREATE USER] - creating user in Stytch...");
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
      name: data.name,
      trusted_metadata: data.trusted_metadata,
      session_duration_minutes: data.sessionDurationMin,
    };
    const response = await stytchClient.passwords.create(params);
    return response;
  } catch (error) {
    console.error("Error creating user in Stytch: ", error);
  }
};

// Initialize user login with password
const initUserLoginWithPassword = async (data: {
  email: string;
  password: string;
  sessionDurationMin: number;
}) => {
  try {
    const response = await stytchClient.passwords.authenticate({
      email: data.email,
      password: data.password,
      session_duration_minutes: data.sessionDurationMin,
    });
    if (response.status_code === 200) {
      return {
        error: false,
        isUserNeedToBeCreated: false,
        message: "User authenticated successfully",
        data: response,
      };
    }
  } catch (error) {
    console.error("Error logging user in Stytch: ", error);
    if (
      error &&
      typeof error === "object" &&
      "error_type" in error &&
      error.error_type === "email_not_found"
    ) {
      return {
        error: true,
        isUserNeedToBeCreated: true,
        message: "User not found in Stytch, need to be created",
        data: null,
      };
    }
    // Default fallback
    return {
      error: true,
      isUserNeedToBeCreated: false,
      message: "Authentication failed",
      data: null,
    };
  }
};

/**
 *
 * @param data - The data to login a user in Stytch
 * @param data.email - The email of the user
 * @param data.password - The password of the user
 * @param data.name - The name of the user
 * @param data.name.first_name - The first name of the user
 * @param data.name.last_name - The last name of the user
 * @param data.trusted_metadata - The trusted metadata of the user
 * @param data.trusted_metadata.dbWorkspaceId - The ID of the workspace
 * @param data.trusted_metadata.dbUserId - The ID of the user
 * @param data.sessionDurationMin - The duration of the session in minutes
 * @returns The response from the Stytch API
 */
const loginUserInStytch = async (data: {
  email: string;
  password: string;
  name?: {
    first_name?: string;
    last_name?: string;
  };
  trusted_metadata?: {
    dbWorkspaceId?: string;
    dbUserId?: string;
  };
  sessionDurationMin: number;
}) => {
  try {
    // Check if user exists in Stytch
    const response = await initUserLoginWithPassword(data);
    if (response && !response.error && !response.isUserNeedToBeCreated) {
      console.log("[STYTCH SERVICE - LOGIN USER] - user is exists in Stytch");
      return response.data;
    } else if (response && response.error && response.isUserNeedToBeCreated) {
      console.log(
        "[STYTCH SERVICE - LOGIN USER] - user is NOT exists in Stytch, creating user in Stytch...",
        response
      );
      // Create user in Stytch if not exists
      const user = await createUserInStytch({
        email: data.email,
        password: data.password,
        name: data.name,
        trusted_metadata: data.trusted_metadata,
        sessionDurationMin: data.sessionDurationMin,
      });
      return user;
    } else {
      console.log(
        "[STYTCH SERVICE - LOGIN USER] - failed to login user in Stytch, even after retry...",
        response
      );
      // User not found in Stytch, even after retry
      return null;
    }
  } catch (error) {
    console.error("Error logging user in Stytch: ", error);
  }
};

// const verifyStytchSessionToken = async (token: string) => {
//   try {
//     const response = await stytchClient.sessions.authenticate({ token });
//     return response;
//   } catch (error) {
//     console.error("Error verifying Stytch session token: ", error);
//   }
// };

export const stytchService = {
  migratePasswordToStytch,
  checkPasswordStrength,
  createUserInStytch,
  loginUserInStytch,
};
