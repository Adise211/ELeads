import { z } from "zod";
import { ClientDTO } from "../types/data-dto.js";
import { ClientPriority, ClientStatus } from "../types/prisma-enums.js";
// import { createBillingSchema } from "./billing.schema.js";
const baseClientSchema = z.object({
  name: z.optional(z.string()),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone is required" }),
  address: z.optional(z.string()),
  city: z.optional(z.string()),
  state: z.optional(z.string()),
  zipCode: z.optional(z.string()),
  country: z.string().min(1, { message: "Country is required" }),
  company: z.string().min(1, { message: "Company is required" }),
  industry: z.optional(z.string()),
  website: z.optional(z.string()),
  status: z.nativeEnum(ClientStatus),
  priority: z.nativeEnum(ClientPriority),
  // billing: z.optional(z.array(createBillingSchema)),
  workspaceId: z.string().min(1, { message: "Workspace ID is required" }),
  leadId: z.optional(z.string()),
  assignedToId: z.optional(z.string()),
});
export const createClientSchema: z.ZodType<ClientDTO> = baseClientSchema;
export const updateClientSchema: z.ZodType<ClientDTO> = baseClientSchema.extend({
  id: z.string().min(1, { message: "ID is required" }),
});

export const deleteClientSchema: z.ZodType<{ id: string }> = z.object({
  id: z.string().min(1, { message: "ID is required" }),
});
