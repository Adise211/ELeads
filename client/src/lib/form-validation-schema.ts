import type { LoginFormValues, SignupFormData } from "client.types";
import { z } from "zod";
import { types } from "@eleads/shared";

export const loginFormSchema: z.ZodType<LoginFormValues> = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export const signupFormSchema: z.ZodType<SignupFormData> = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    phone: z.string().min(10, { message: "Phone number must be at least 10 digits long" }),
    workspaceName: z.string().optional(),
    workspaceId: z.string().optional(),
    workspaceType: z.enum(["new", "existing"]).optional(),
  })
  // custom validation with conditional logic
  // workspaceName is required when workspaceType is "new"
  .refine(
    (data) => {
      if (data.workspaceType === "new") {
        return data.workspaceName && data.workspaceName.trim().length > 0;
      }
      return true;
    },
    {
      message: "Workspace name is required when creating a new workspace",
      path: ["workspaceName"],
    }
  )
  // workspaceId is required when workspaceType is "existing"
  .refine(
    (data) => {
      if (data.workspaceType === "existing") {
        return data.workspaceId && data.workspaceId.trim().length > 0;
      }
      return true;
    },
    {
      message: "Workspace ID is required when joining an existing workspace",
      path: ["workspaceId"],
    }
  );

export const leadFormSchema: z.ZodType<types.LeadDTO> = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  company: z.string().min(1, { message: "Company is required" }),
  jobTitle: z.string().min(1, { message: "Job title is required" }),
  industry: z.string().min(1, { message: "Industry is required" }),
  status: z.nativeEnum(types.LeadStatus),
  country: z.string().min(1, { message: "Country is required" }),
  website: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  notes: z.array(z.object({ content: z.string() })).optional(),
  activities: z
    .array(
      z.object({
        type: z.nativeEnum(types.ActivityType),
        description: z.string(),
      })
    )
    .optional(),
  assignedToId: z.string().optional(),
});
