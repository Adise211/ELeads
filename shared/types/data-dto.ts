import { ActivityType, ClientPriority, ClientStatus, LeadStatus, UserRole } from "./prisma-enums";

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
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle?: string;
  industry?: string;
  status: LeadStatus;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  notes?: NoteDTO[];
  activities?: ActivityDTO[];
  assignedToId?: string;
  assignedTo?: UserDTO;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ActivityDTO = {
  id?: string;
  type: ActivityType;
  description: string;
  leadId?: string;
  lead?: LeadDTO;
  userId?: string;
  user?: UserDTO;
  createdAt?: Date;
  updatedAt?: Date;
};

export type NoteDTO = {
  id?: string;
  content: string;
  leadId?: string;
  lead?: LeadDTO;
  createdAt?: Date;
  updatedAt?: Date;
};

export type ClientDTO = {
  id?: string;
  name?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  company: string;
  industry?: string;
  website?: string;
  // billing?: BillingDTO[];
  status: ClientStatus;
  priority: ClientPriority;
  workspaceId: string;
  leadId?: string;
  assignedToId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type BillingDTO = {
  id?: string;
  clientId: string;
  billedAmount: number;
  currency: string;
  billingCycle?: string;
  paymentTerms?: string;
  userPercentage: number;
  billingDate?: string;
  billingDueDate?: string;
  billingNotes?: string;
  billingAttachments?: string[];
  workspaceId: string;
  createdAt?: Date;
  updatedAt?: Date;
};
