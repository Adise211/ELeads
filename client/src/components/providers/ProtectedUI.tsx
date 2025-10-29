import { useAuthStore } from "@/stores/authStore";
import { useMemo, type ReactNode } from "react";
import { types } from "@eleads/shared";

interface ProtectedUIProps {
  children: ReactNode;
  allowedPermissions?: types.Permission[];
  allowedRoles?: types.UserRole[];
  itemOwnerId?: string;
  // blockPermissions?: Permission[];
  // blockRoles?: UserRole[];
}

const ProtectedUI = ({
  children,
  allowedPermissions,
  allowedRoles,
  itemOwnerId,
  // blockPermissions,
  // blockRoles,
}: ProtectedUIProps) => {
  const { isUserHasPermission, isUserHasRole } = useAuthStore();
  const userId = useAuthStore((state) => state.user?.id);

  const showUIElement = useMemo(() => {
    // User without the required permission and does not own the item

    // User does not have the required permissions
    if (allowedPermissions && !isUserHasPermission(allowedPermissions)) {
      // User does not have the required permissions and does not own the item
      return itemOwnerId && itemOwnerId === userId;
    }
    // User does not have the required role
    if (allowedRoles && !isUserHasRole(allowedRoles)) {
      return false;
    }
    // User has the required permissions and role
    return true;
  }, [allowedPermissions, allowedRoles, isUserHasPermission, isUserHasRole, itemOwnerId, userId]);

  return <>{showUIElement ? children : null}</>;
};

export default ProtectedUI;
