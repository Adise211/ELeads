import api from "../httpConfig";
import type { SuccessResponse } from "../types/api.types";
import { types } from "@eleads/shared";

export const billingsService = {
  /**
   * Create a new billing
   */
  createBilling: async (billing: types.BillingDTO): Promise<SuccessResponse> => {
    const response = await api.post("/billings/create", billing);
    return response.data;
  },
  /**
   * Update a billing
   */
  updateBilling: async (billing: types.BillingDTO): Promise<SuccessResponse> => {
    const response = await api.put("/billings/update", billing);
    return response.data;
  },
  /**
   * Delete a billing
   */
  deleteBilling: async (id: string): Promise<SuccessResponse> => {
    const response = await api.delete(`/billings/${id}`);
    return response.data;
  },
  /**
   * Get a billing by id
   */
  getBillingById: async (id: string): Promise<SuccessResponse> => {
    const response = await api.get(`/billings/${id}`);
    return response.data;
  },
};
