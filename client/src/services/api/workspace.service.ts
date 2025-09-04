import api from "../httpConfig";
import type { SuccessResponse } from "../types/api.types";

export const workspaceService = {
  /**
   * Get workspace by ID
   */
  getWorkspaceById: async (id: string): Promise<SuccessResponse> => {
    const response = await api.get(`/workspaces/${id}`);
    return response.data;
  },

  getWorkspaceLeads: async (): Promise<SuccessResponse> => {
    const response = await api.get(`/workspace/all-leads`);
    return response.data;
  },

  getWorkspaceUsers: async (): Promise<SuccessResponse> => {
    const response = await api.get(`/workspace/all-users`);
    return response.data;
  },
  getWorkspaceBillings: async (): Promise<SuccessResponse> => {
    const response = await api.get(`/workspace/all-billings`);
    return response.data;
  },
  getWorkspaceClients: async (): Promise<SuccessResponse> => {
    const response = await api.get(`/workspace/all-clients`);
    return response.data;
  },

  // /**
  //  * Get current user's workspace
  //  */
  // getCurrentWorkspace: async (): Promise<SuccessResponse> => {
  //   const response = await api.get("/workspaces/current");
  //   return response.data;
  // },

  // /**
  //  * Update workspace settings
  //  */
  // updateWorkspace: async (
  //   id: string,
  //   workspaceData: Partial<Workspace>
  // ): Promise<SuccessResponse> => {
  //   const response = await api.put(`/workspaces/${id}`, workspaceData);
  //   return response.data;
  // },

  // /**
  //  * Delete workspace
  //  */
  // deleteWorkspace: async (id: string): Promise<SuccessResponse> => {
  //   const response = await api.delete(`/workspaces/${id}`);
  //   return response.data;
  // },

  // /**
  //  * Get workspace statistics
  //  */
  // getWorkspaceStats: async (id: string): Promise<SuccessResponse> => {
  //   const response = await api.get(`/workspaces/${id}/stats`);
  //   return response.data;
  // },

  // /**
  //  * Get workspace members
  //  */
  // getWorkspaceMembers: async (id: string): Promise<SuccessResponse> => {
  //   const response = await api.get(`/workspaces/${id}/members`);
  //   return response.data;
  // },

  // /**
  //  * Remove member from workspace
  //  */
  // removeMember: async (workspaceId: string, userId: string): Promise<SuccessResponse> => {
  //   const response = await api.delete(`/workspaces/${workspaceId}/members/${userId}`);
  //   return response.data;
  // },

  // /**
  //  * Update workspace member role
  //  */
  // updateMemberRole: async (
  //   workspaceId: string,
  //   userId: string,
  //   role: UserRole
  // ): Promise<SuccessResponse> => {
  //   const response = await api.patch(`/workspaces/${workspaceId}/members/${userId}`, { role });
  //   return response.data;
  // },
};
