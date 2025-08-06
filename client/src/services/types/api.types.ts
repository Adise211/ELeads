// API Types for all service requests and responses
import type {
  UserDTO,
  WorkspaceDTO,
  LeadDTO,
  SuccessResponse,
  ErrorResponse,
  LeadStatus,
  UserRole,
  Permission,
} from "@eleads/shared";

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
  status?: LeadStatus;
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
  status?: LeadStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// Re-export shared types for convenience
export type {
  UserDTO as User,
  WorkspaceDTO as Workspace,
  LeadDTO as Lead,
  SuccessResponse,
  ErrorResponse,
  LeadStatus,
  UserRole,
  Permission,
};
