import { loadStytch } from "../lib/loadStytch.js";
import { StytchUpdateUserParams } from "../server.types.js";

const stytchClient = loadStytch();
const DEFAULT_SESSION_DURATION_IN_MINUTES =
  Number(process.env.STYTCH_SESSION_DURATION_IN_MINUTES as string) || 60;

const sendOTPToUserViaEmail = async (email: string) => {
  try {
    const response = await stytchClient.otps.email.loginOrCreate({ email });
    return response;
  } catch (error) {
    console.error("Error sending OTP to user via email: ", error);
  }
};

const verifyOTPCode = async (methodId: string, otp: string) => {
  try {
    const params = {
      method_id: methodId,
      code: otp,
      session_duration_minutes: DEFAULT_SESSION_DURATION_IN_MINUTES,
    };
    const response = await stytchClient.otps.authenticate(params);
    return response;
  } catch (error) {
    console.error("Error verifying OTP code: ", error);
  }
};

const resetPasswordByExistingSession = async (sessionToken: string, newPassword: string) => {
  try {
    const response = await stytchClient.passwords.sessions.reset({
      password: newPassword,
      session_token: sessionToken,
      session_duration_minutes: DEFAULT_SESSION_DURATION_IN_MINUTES,
    });
    return response;
  } catch (error) {
    console.error("Error resetting password by existing session: ", error);
  }
};

const updateUserInfoInStytch = async (stytchUserId: string, data: StytchUpdateUserParams) => {
  try {
    const params = {
      user_id: stytchUserId, // Required
      name: {
        first_name: data.name.firstName || "",
        last_name: data.name.lastName || "",
      },
      trusted_metadata: {
        dbUserId: data.dbUserId || "",
        dbUserEmail: data.email || "",
        dbWorkspaceId: data.workspaceId, // Required
        dbUserPermissions: data.permissions || [],
        dbUserRole: data.role || "",
      },
    };
    console.log("[UPDATE USER INFO IN STYTCH] - Updating user info in Stytch: ", params);

    const response = await stytchClient.users.update(params);
    return response;
  } catch (error) {
    console.error("Error updating user info in Stytch: ", error);
  }
};

const authenticateUserByPasswordInStytch = async (email: string, password: string) => {
  try {
    const params = {
      email: email,
      password: password,
      session_duration_minutes: DEFAULT_SESSION_DURATION_IN_MINUTES,
    };
    const response = await stytchClient.passwords.authenticate(params);
    return response;
  } catch (error) {
    console.error("Error authenticating password in Stytch: ", error);
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

// Stytch session authentication
export async function verifyStytchSession(sessionToken: string): Promise<any> {
  try {
    const stytchClient = loadStytch();
    const response = await stytchClient.sessions.authenticate({ session_token: sessionToken });
    return response;
  } catch (error) {
    console.error("Error verifying Stytch session: ", error);
    return null;
  }
}

const revokeOrLogoutUserFromStytch = async (sessionToken: string) => {
  try {
    const response = await stytchClient.sessions.revoke({ session_token: sessionToken });
    return response;
  } catch (error) {
    console.error("Error revoking or logging out user from Stytch: ", error);
  }
};

export const resetExistingUserPasswordInStytch = async (data: {
  email: string;
  existingPassword: string;
  newPassword: string;
}) => {
  try {
    const response = await stytchClient.passwords.existingPassword.reset({
      email: data.email,
      existing_password: data.existingPassword,
      new_password: data.newPassword,
      session_duration_minutes: DEFAULT_SESSION_DURATION_IN_MINUTES,
    });
    return response;
  } catch (error) {
    console.error("Error resetting existing user password in Stytch: ", error);
  }
};

export const stytchService = {
  sendOTPToUserViaEmail,
  verifyOTPCode,
  resetPasswordByExistingSession,
  updateUserInfoInStytch,
  authenticateUserByPasswordInStytch,
  checkPasswordStrength,
  verifyStytchSession,
  revokeOrLogoutUserFromStytch,
  resetExistingUserPasswordInStytch,
};
