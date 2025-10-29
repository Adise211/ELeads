import z from "zod";
import { schemas } from "@eleads/shared";

// User
export const loginUserSchema = z.object({
  body: schemas.loginUserSchema,
});

export const registerUserSchema = z.object({
  body: schemas.registerUserSchema,
});

export const sendOTPToUserSchema = z.object({
  body: schemas.sendOTPToUserSchema,
});

export const verifyOTPCodeSchema = z.object({
  body: z.object({
    email: z.string().email(),
    otp: z.string().min(1, { message: "OTP is required" }),
  }),
});

// Lead
export const createLeadSchema = z.object({
  body: schemas.leadSchema,
});

export const updateLeadSchema = z.object({
  body: schemas.leadSchema,
});

// Note
export const createNoteSchema = z.object({
  body: z.intersection(
    schemas.noteSchema,
    z.object({
      leadId: z.string().min(1, { message: "Lead ID is required" }),
    })
  ),
});

export const updateNoteSchema = z.object({
  body: z.intersection(
    schemas.noteSchema,
    z.object({
      noteId: z.string().min(1, { message: "Note ID is required" }),
    })
  ),
});

export const deleteNoteSchema = z.object({
  params: z.object({
    noteId: z.string().min(1, { message: "Note ID is required" }),
  }),
});

// Activity
export const createActivitySchema = z.object({
  body: z.intersection(
    schemas.activitySchema,
    z.object({
      leadId: z.string().min(1, { message: "Lead ID is required" }),
    })
  ),
});

export const updateActivitySchema = z.object({
  body: z.intersection(
    schemas.activitySchema,
    z.object({
      activityId: z.string().min(1, { message: "Activity ID is required" }),
    })
  ),
});

export const deleteActivitySchema = z.object({
  params: z.object({
    activityId: z.string().min(1, { message: "Activity ID is required" }),
  }),
});

// Billing
export const createBillingSchema = z.object({
  body: schemas.createBillingSchema,
});

export const updateBillingSchema = z.object({
  body: schemas.updateBillingSchema,
});

export const deleteBillingSchema = z.object({
  params: schemas.deleteBillingSchema,
});

export const getBillingSchema = z.object({
  params: z.object({
    billingId: z.string().min(1, { message: "Billing ID is required" }),
  }),
});

// Client
export const createClientSchema = z.object({
  body: schemas.createClientSchema,
});

export const updateClientSchema = z.object({
  body: schemas.updateClientSchema,
});

export const deleteClientSchema = z.object({
  params: schemas.deleteClientSchema,
});

export const getClientSchema = z.object({
  params: z.object({
    clientId: z.string().min(1, { message: "Client ID is required" }),
  }),
});
