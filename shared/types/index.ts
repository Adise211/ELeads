import { ActivityType, UserRole } from "./prisma-enums";

// DTO stands for Data Transfer Object.
// It is a simple object used to transfer data between different layers or parts of an application,
// typically without any business logic.

export type UserDTO = {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl: string | null;
  isActive: boolean;
  phone: string;
  workspaceId: string;
  workspace: WorkspaceDTO;
  permissions: string[];
  leads: LeadDTO[];
  activities: ActivityDTO[];
  createdAt?: Date;
  updatedAt?: Date;
};

export type WorkspaceDTO = {
  id?: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type LeadDTO = {
  id?: string;
  name: string;
  email: string;
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ActivityDTO = {
  id?: string;
  type: ActivityType;
  description: string;
  leadId: string;
  lead: LeadDTO;
  userId: string;
  user: UserDTO;
  createdAt?: Date;
  updatedAt?: Date;
};

export type NoteDTO = {
  id?: string;
  content: string;
  leadId: string;
  lead: LeadDTO;
  createdAt?: Date;
  updatedAt?: Date;
};

export interface SuccessResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface ErrorResponse {
  success: boolean;
  status: string;
  message: string;
  error?: any;
  stack?: string;
}
