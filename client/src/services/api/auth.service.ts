import api from "../httpConfig";
import type { LoginRequest, RegisterRequest, SuccessResponse } from "../types/api.types";

export const authService = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginRequest): Promise<SuccessResponse> => {
    const response = await api.post("/users/login", credentials);
    return response.data;
  },

  /**
   * Register new user with workspace
   */
  register: async (userData: RegisterRequest): Promise<SuccessResponse> => {
    const response = await api.post("/users/register", userData);
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<SuccessResponse> => {
    const response = await api.get("/users/me");
    return response.data;
  },

  /**
   * Logout current user
   */
  logout: async (): Promise<void> => {
    await api.get("/users/logout");
  },

  /**
   * Refresh user session/token
   */
  refreshToken: async (): Promise<SuccessResponse> => {
    const response = await api.post("/users/refresh");
    return response.data;
  },

  /**
   * Change user password
   */
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ): Promise<SuccessResponse> => {
    const response = await api.post("/users/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  /**
   * Update user information
   */
  updateUserInfo: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  }): Promise<SuccessResponse> => {
    const response = await api.put("/users/update-info", userData);
    return response.data;
  },
};
