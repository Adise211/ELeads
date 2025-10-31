import type { LeadStatus, Permission, UserRole } from "./types/prisma-enums.js";

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

export const permissionsOptions: Record<Permission, string> = {
  MANAGE_OWN_LEADS: "MANAGE_OWN_LEADS",
  MANAGE_USERS: "MANAGE_USERS",
  MANAGE_BILLING: "MANAGE_BILLING",
  EDIT_WORKSPACE_LEADS: "EDIT_WORKSPACE_LEADS",
  DELETE_WORKSPACE_LEADS: "DELETE_WORKSPACE_LEADS",
  ASSIGN_LEADS: "ASSIGN_LEADS",
  VIEW_BILLING: "VIEW_BILLING",
  CREATE_BILLING: "CREATE_BILLING",
  EDIT_BILLING: "EDIT_BILLING",
  DELETE_BILLING: "DELETE_BILLING",
};

export const roleOptions: Record<UserRole, string> = {
  ADMIN: "ADMIN",
  USER: "USER",
  MANAGER: "MANAGER",
};

export const leadStatusOptions: Record<LeadStatus, string> = {
  NEW: "NEW",
  INPROGRESS: "INPROGRESS",
  LOST: "LOST",
};

export const featureFlags: Record<string, boolean> = {
  AUTH_BY_STYTCH: true,
};

export const featureFlagTextOptions: Record<string, string> = {
  SOON: "Soon",
  NEW: "New",
  ALPHA: "Alpha",
  BETA: "Beta",
};
