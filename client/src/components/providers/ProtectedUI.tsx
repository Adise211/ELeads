import { useAuthStore } from "@/stores/authStore";
import { useMemo, type ReactNode } from "react";
import type { Permission, UserRole } from "@eleads/shared";

interface ProtectedUIProps {
  children: ReactNode;
  allowedPermissions?: Permission[];
  allowedRoles?: UserRole[];
  // blockPermissions?: Permission[];
  // blockRoles?: UserRole[];
}

const ProtectedUI = ({
  children,
  allowedPermissions,
  allowedRoles,
  // blockPermissions,
  // blockRoles,
}: ProtectedUIProps) => {
  const { isUserHasPermission, isUserHasRole } = useAuthStore();

  const showUIElement = useMemo(() => {
    // User does not have the required permissions
    if (allowedPermissions && !isUserHasPermission(allowedPermissions)) {
      return false;
    }
    // User does not have the required role
    if (allowedRoles && !isUserHasRole(allowedRoles)) {
      return false;
    }
    // User has the required permissions and role
    return true;
  }, [allowedPermissions, allowedRoles, isUserHasPermission, isUserHasRole]);

  return <>{showUIElement ? children : null}</>;
};

export default ProtectedUI;
