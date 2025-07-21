import { ActivityType, UserRole } from "./prisma-enums";

export type UserDTO = {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
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

export const httpCodes = {
  SUCCESS: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  NOT_FOUND: 404,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  INTERNAL_SERVER_ERROR: 500,
};
