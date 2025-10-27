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
  // Email Verification
  otp: string;
  isEmailVerified: boolean;
  // Workspace Info
  workspaceType?: "new" | "existing";
  workspaceName?: string;
  workspaceId?: string;
}
