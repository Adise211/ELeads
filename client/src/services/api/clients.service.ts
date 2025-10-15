import api from "../httpConfig";
import type { PaginationParams, SuccessResponse } from "../types/api.types";
import { types } from "@eleads/shared";

export const clientsService = {
  /**
   * Get all clients with optional pagination and filtering
   */
  getWorkspaceClients: async (params?: PaginationParams): Promise<SuccessResponse> => {
    const response = await api.get("/clients", { params });
    return response.data;
  },

  /**
   * Get a single client by ID
   */
  getClientById: async (id: string): Promise<SuccessResponse> => {
    const response = await api.get(`/clients/${id}`);
    return response.data;
  },

  /**
   * Create a new client
   */
  createClient: async (clientData: types.ClientDTO): Promise<SuccessResponse> => {
    const response = await api.post("/clients/create", clientData);
    return response.data;
  },

  /**
   * Update an existing client
   */
  updateClient: async (clientData: types.ClientDTO): Promise<SuccessResponse> => {
    const response = await api.put(`/clients/update`, clientData);
    return response.data;
  },

  /**
   * Delete a client
   */
  deleteClient: async (id: string): Promise<SuccessResponse> => {
    const response = await api.delete(`/clients/delete/${id}`);
    return response.data;
  },

  /**
   * Get clients statistics
   */
  getClientsStats: async (workspaceId: string): Promise<SuccessResponse> => {
    const response = await api.get(`/clients/stats/${workspaceId}`);
    return response.data;
  },
};
