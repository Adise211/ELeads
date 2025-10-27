import { LeadStatus, Permission, UserRole } from "@prisma/client";

// Custom error interface
export interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

// Error response interface
export interface ErrorResponse {
  success: boolean;
  status: string;
  message: string;
  error?: any;
  stack?: string;
}

export interface SuccessResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface RegisterUserFields {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  };
  workspace: {
    name?: string;
    id?: string;
  };
}

export interface CreateLeadInput {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  industry?: string;
  status?: LeadStatus;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  workspaceId: string;
}

export interface StytchCreatUserParams {
  email: string;
  password: string;
  name?: {
    first_name?: string;
    last_name?: string;
  };
  trusted_metadata: {
    dbUserId: string;
    dbUserEmail: string;
    dbWorkspaceId: string;
    dbUserRole: string[];
    dbUserPermissions: Permission[];
  };
  sessionDurationMin: number;
}
export interface StytchErrorResponse {
  status_code: number;
  request_id: string;
  error_type?: string;
  error_message?: string;
  error_url?: string;
  error_details?: string | undefined;
}

export type StytchUpdateUserParams = {
  dbUserId: string;
  email: string;
  name: { firstName?: string; lastName?: string };
  workspaceId: string;
  role?: UserRole;
  permissions?: Permission[];
};
