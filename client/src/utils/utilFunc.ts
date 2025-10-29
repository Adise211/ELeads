import { consts } from "@eleads/shared";

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatPermissionDisplay(permissionKey: string): string {
  switch (permissionKey) {
    case consts.permissionsOptions.MANAGE_OWN_LEADS:
      return "manage:own-leads";
    case consts.permissionsOptions.EDIT_WORKSPACE_LEADS:
      return "edit:workspace-leads";
    case consts.permissionsOptions.DELETE_WORKSPACE_LEADS:
      return "delete:workspace-leads";
    case consts.permissionsOptions.ASSIGN_LEADS:
      return "assign:leads";
    case consts.permissionsOptions.MANAGE_USERS:
      return "manage:users";
    case consts.permissionsOptions.MANAGE_BILLING:
      return "manage:billing";
    case consts.permissionsOptions.VIEW_BILLING:
      return "view:billing";
    case consts.permissionsOptions.CREATE_BILLING:
      return "create:billing";
    case consts.permissionsOptions.EDIT_BILLING:
      return "edit:billing";
    case consts.permissionsOptions.DELETE_BILLING:
      return "delete:billing";
    default:
      // Fallback for any other permissions
      return permissionKey.replace(/_/g, "-").toLowerCase();
  }
}

/**
 * Converts camelCase or snake_case strings to Title Case with proper spacing
 * @param text - The string to convert (e.g., "firstName", "user_name", "email")
 * @returns Formatted string (e.g., "First Name", "User Name", "Email")
 */
export function formatToTitleCase(text: string): string {
  return text
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .trim(); // Remove any leading/trailing spaces
}
