import { z } from "zod";
import { BillingDTO } from "../types/data-dto.js";
import { BillingStatus } from "../types/prisma-enums.js";

export const baseBillingSchema = z.object({
  id: z.string().min(1, { message: "ID is required" }),
  clientId: z.string().min(1, { message: "Client ID is required" }), // is required when updating!
  billedAmount: z.number().min(1, { message: "Billed amount is required" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  billingCycle: z.string().optional(),
  paymentTerms: z.string().optional(),
  userCommission: z.number().min(1, { message: "User commission is required" }),
  billingStatus: z.nativeEnum(BillingStatus),
  billingDate: z.string().min(1, { message: "Billing date is required" }),
  billingDueDate: z.string().min(1, { message: "Billing due date is required" }),
  billingNotes: z.string().optional(),
  billingAttachments: z.array(z.string()).optional(),
});

export const createBillingSchema: z.ZodType<BillingDTO> = baseBillingSchema.omit({ id: true });

export const updateBillingSchema: z.ZodType<BillingDTO> = baseBillingSchema;

export const deleteBillingSchema: z.ZodType<{ id: string }> = z.object({
  id: z.string().min(1, { message: "ID is required" }),
});
