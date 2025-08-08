// API Types for all service requests and responses
import { types } from "@eleads/shared";

// Request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
  };
  workspace: {
    name?: string;
    id?: string;
  };
}

// Request types
export interface CreateLeadRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string[];
  company: string;
  jobTitle?: string;
  industry?: string;
  status?: types.LeadStatus;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  workspaceId: string;
}

export interface UpdateLeadRequest extends Partial<CreateLeadRequest> {
  id: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: types.LeadStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Re-export shared types for convenience
export type User = types.UserDTO;
export type Workspace = types.WorkspaceDTO;
export type Lead = types.LeadDTO;
export type SuccessResponse = types.SuccessResponse;
export type ErrorResponse = types.ErrorResponse;
export type LeadStatus = types.LeadStatus;
export type UserRole = types.UserRole;
export type Permission = types.Permission;
