import api from "../httpConfig";
import type {
  CreateLeadRequest,
  UpdateLeadRequest,
  PaginationParams,
  // LeadStatus,
  SuccessResponse,
} from "../types/api.types";

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
  createLead: async (leadData: CreateLeadRequest): Promise<SuccessResponse> => {
    const response = await api.post("/leads/create", leadData);
    return response.data;
  },

  /**
   * Update an existing lead
   */
  updateLead: async (leadData: UpdateLeadRequest): Promise<SuccessResponse> => {
    const response = await api.put(`/leads/${leadData.id}`, leadData);
    return response.data;
  },

  /**
   * Delete a lead
   */
  deleteLead: async (id: string): Promise<SuccessResponse> => {
    const response = await api.delete(`/leads/${id}`);
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
