import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserDTO, Permission, UserRole } from "@eleads/shared";
import { roleOptions } from "@eleads/shared";

type AuthState = {
  user: UserDTO | null;
  setUser: (user: UserDTO | null) => void;
  clearUser: () => void;
  isAdminRole: () => boolean;
  isUserHasPermission: (allowedPermissions: Permission[]) => boolean;
  isUserHasRole: (allowedRoles: UserRole[]) => boolean;
};

export const useAuthStore = create<AuthState>()(
  // persist user in local storage
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      isAdminRole: () => {
        const currentUser = get().user;
        if (!currentUser) return false;
        return currentUser.role === roleOptions.ADMIN;
      },
      isUserHasPermission: (allowedPermissions: Permission[]) => {
        // if user is admin, return true
        const currentUser = get().user;
        if (!currentUser) return false;
        if (get().isAdminRole()) return true;
        return !!currentUser?.permissions?.some((permission) =>
          allowedPermissions.includes(permission as Permission)
        );
      },
      isUserHasRole: (allowedRoles: UserRole[]) => {
        const currentUser = get().user;
        if (!currentUser) return false;
        if (get().isAdminRole()) return true;
        return allowedRoles.includes(currentUser.role as UserRole);
      },
    }),
    {
      name: "user", // key in localStorage
      partialize: (state) => ({ user: state.user }),
    }
  )
);
