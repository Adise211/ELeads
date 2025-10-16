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
