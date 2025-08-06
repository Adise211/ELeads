// import api from "../httpConfig";
// import type { User, Permission, SuccessResponse } from "../types/api.types";

// export const usersService = {
//   /**
//    * Get all users in workspace
//    */
//   getWorkspaceUsers: async (workspaceId: string): Promise<SuccessResponse> => {
//     const response = await api.get(`/users/workspace/${workspaceId}`);
//     return response.data;
//   },

//   /**
//    * Get user by ID
//    */
//   getUserById: async (id: string): Promise<SuccessResponse> => {
//     const response = await api.get(`/users/${id}`);
//     return response.data;
//   },

//   /**
//    * Update user profile
//    */
//   updateUser: async (id: string, userData: Partial<User>): Promise<SuccessResponse> => {
//     const response = await api.put(`/users/${id}`, userData);
//     return response.data;
//   },

//   /**
//    * Delete user
//    */
//   deleteUser: async (id: string): Promise<SuccessResponse> => {
//     const response = await api.delete(`/users/${id}`);
//     return response.data;
//   },

//   /**
//    * Update user permissions
//    */
//   updateUserPermissions: async (
//     id: string,
//     permissions: Permission[]
//   ): Promise<SuccessResponse> => {
//     const response = await api.patch(`/users/${id}/permissions`, { permissions });
//     return response.data;
//   },

//   /**
//    * Invite user to workspace
//    */
//   inviteUser: async (
//     workspaceId: string,
//     email: string,
//     permissions: Permission[]
//   ): Promise<SuccessResponse> => {
//     const response = await api.post("/users/invite", {
//       workspaceId,
//       email,
//       permissions,
//     });
//     return response.data;
//   },

//   /**
//    * Change user password
//    */
//   changePassword: async (
//     currentPassword: string,
//     newPassword: string
//   ): Promise<SuccessResponse> => {
//     const response = await api.patch("/users/change-password", {
//       currentPassword,
//       newPassword,
//     });
//     return response.data;
//   },

//   /**
//    * Upload user avatar
//    */
//   uploadAvatar: async (file: File): Promise<SuccessResponse> => {
//     const formData = new FormData();
//     formData.append("avatar", file);

//     const response = await api.post("/users/avatar", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });
//     return response.data;
//   },
// };
