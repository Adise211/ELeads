import api from "../httpConfig";
import type { PaginationParams, SuccessResponse } from "../types/api.types";
import { types } from "@eleads/shared";

export const leadsService = {
  /**
   * Get all leads with optional pagination and filtering
   */
  // TODO: Add pagination and filtering (from params)
  getWorkspaceLeads: async (params?: PaginationParams): Promise<SuccessResponse> => {
    const response = await api.get("/leads", { params });
    return response.data;
  },

  /**
   * Get a single lead by ID
   */
  getLeadById: async (id: string): Promise<SuccessResponse> => {
    const response = await api.get(`/leads/${id}`);
    return response.data;
  },

  /**
   * Create a new lead
   */
  createLead: async (leadData: types.LeadDTO): Promise<SuccessResponse> => {
    const response = await api.post("/leads/create", leadData);
    return response.data;
  },

  /**
   * Update an existing lead
   */
  updateLead: async (leadData: types.LeadDTO): Promise<SuccessResponse> => {
    const response = await api.put(`/leads/update`, leadData);
    return response.data;
  },

  /**
   * Delete a lead
   */
  deleteLead: async (id: string, assignedToId: string): Promise<SuccessResponse> => {
    const response = await api.delete(`/leads/delete/${id}?assignedToId=${assignedToId}`);
    return response.data;
  },

  /**
   * Bulk update leads status
   */
  // bulkUpdateStatus: async (leadIds: string[], status: LeadStatus): Promise<SuccessResponse> => {
  //   const response = await api.patch("/leads/bulk-update-status", {
  //     leadIds,
  //     status,
  //   });
  //   return response.data;
  // },

  /**
   * Assign lead to user
   */
  // assignLead: async (leadId: string, userId: string): Promise<SuccessResponse> => {
  //   const response = await api.patch(`/leads/${leadId}/assign`, {
  //     userId,
  //   });
  //   return response.data;
  // },

  /**
   * Get leads statistics
   */
  // getLeadsStats: async (workspaceId: string): Promise<SuccessResponse> => {
  //   const response = await api.get(`/leads/stats/${workspaceId}`);
  //   return response.data;
  // },
};
