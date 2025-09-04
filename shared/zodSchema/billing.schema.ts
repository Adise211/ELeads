import { z } from "zod";
import { BillingDTO } from "../types/data-dto.js";
import { BillingStatus } from "../types/prisma-enums.js";

export const createBillingSchema: z.ZodType<BillingDTO> = z.object({
  clientId: z.string().min(1, { message: "Client ID is required" }),
  billedAmount: z.number().min(1, { message: "Billed amount is required" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  billingCycle: z.string().optional(),
  paymentTerms: z.string().optional(),
  userPercentage: z.number().min(1, { message: "User percentage is required" }),
  billingStatus: z.nativeEnum(BillingStatus).default(BillingStatus.PENDING),
  billingDate: z.string().optional(),
  billingDueDate: z.string().optional(),
  billingNotes: z.string().optional(),
  billingAttachments: z.array(z.string()).optional(),
  workspaceId: z.string().min(1, { message: "Workspace ID is required" }),
});

export const updateBillingSchema: z.ZodType<BillingDTO> = z.object({
  id: z.string().min(1, { message: "ID is required" }),
  clientId: z.string().min(1, { message: "Client ID is required" }),
  billedAmount: z.number().min(1, { message: "Billed amount is required" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  billingCycle: z.string().optional(),
  paymentTerms: z.string().optional(),
  userPercentage: z.number().min(1, { message: "User percentage is required" }),
  billingStatus: z.nativeEnum(BillingStatus).default(BillingStatus.PENDING),
  billingDate: z.string().optional(),
  billingDueDate: z.string().optional(),
  billingNotes: z.string().optional(),
  billingAttachments: z.array(z.string()).optional(),
  workspaceId: z.string().min(1, { message: "Workspace ID is required" }),
});

export const deleteBillingSchema: z.ZodType<{ id: string }> = z.object({
  id: z.string().min(1, { message: "ID is required" }),
});
