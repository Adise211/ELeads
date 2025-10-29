import z from "zod";

export const registerUserSchema = z
  .object({
    user: z.object({
      firstName: z
        .string()
        .min(1, { message: "First name is required" })
        .max(25, { message: "First name must be less than 25 characters" }),
      lastName: z
        .string()
        .min(1, { message: "Last name is required" })
        .max(25, { message: "Last name must be less than 25 characters" }),
      email: z.string().email({ message: "Invalid email address" }),
      password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
      phone: z.string().optional(),
    }),
    workspace: z.object({
      name: z.string().optional(),
      id: z.string().optional(),
    }),
  })
  // Workspace name is required when creating a new workspace
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
  // Workspace ID is required when joining an existing workspace
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
  // Workspace must have either a name (for new workspace) or an ID (for existing workspace), but not both
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
  );

export const loginUserSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
});

export const sendOTPToUserSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
});
