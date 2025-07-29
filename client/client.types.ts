export type LoginFormValues = {
  email: string;
  password: string;
};

export interface SignupFormData {
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  // Workspace Info
  workspaceType?: "new" | "existing";
  workspaceName?: string;
  workspaceId?: string;
}
