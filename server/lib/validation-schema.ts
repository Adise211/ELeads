import z from "zod";
import { schemas } from "@eleads/shared";

export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
  }),
});

export const registerUserSchema = z.object({
  body: z
    .object({
      user: z.object({
        firstName: z.string().min(1, { message: "First name is required" }),
        lastName: z.string().min(1, { message: "Last name is required" }),
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
        phone: z.string().min(10, { message: "Phone number must be at least 10 digits long" }),
      }),
      workspace: z.object({
        name: z.string().optional(),
        id: z.string().optional(),
      }),
    })
    .refine(
      (data) => {
        if (data.workspace.name) {
          return data.workspace.name.trim().length > 0;
        }
        return true;
      },
      {
        message: "Workspace name is required when creating a new workspace",
        path: ["body", "workspace", "name"],
      }
    )
    .refine(
      (data) => {
        if (data.workspace.id) {
          return data.workspace.id.trim().length > 0;
        }
        return true;
      },
      {
        message: "Workspace ID is required when joining an existing workspace",
        path: ["body", "workspace", "id"],
      }
    )
    .refine(
      (data) => {
        const hasName = data.workspace.name && data.workspace.name.trim().length > 0;
        const hasId = data.workspace.id && data.workspace.id.trim().length > 0;
        return (hasName && !hasId) || (!hasName && hasId);
      },
      {
        message:
          "Workspace must have either a name (for new workspace) or an ID (for existing workspace), but not both",
        path: ["body", "workspace"],
      }
    ),
});

export const createLeadSchema = z.object({
  body: schemas.leadSchema,
});

export const updateLeadSchema = z.object({
  body: schemas.leadSchema,
});

export const createNoteSchema = z.object({
  body: z.object({
    leadId: z.string().min(1, { message: "Lead ID is required" }),
    content: z.string().min(1, { message: "Note content is required" }),
  }),
});

export const updateNoteSchema = z.object({
  body: z.object({
    noteId: z.string().min(1, { message: "Note ID is required" }),
    content: z.string().min(1, { message: "Note content is required" }),
  }),
});
