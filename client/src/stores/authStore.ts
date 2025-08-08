import { create } from "zustand";
import { persist } from "zustand/middleware";
import { types, consts } from "@eleads/shared";

type AuthState = {
  user: types.UserDTO | null;
  setUser: (user: types.UserDTO | null) => void;
  clearUser: () => void;
  isAdminRole: () => boolean;
  isUserHasPermission: (allowedPermissions: types.Permission[]) => boolean;
  isUserHasRole: (allowedRoles: types.UserRole[]) => boolean;
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
        return currentUser.role === consts.roleOptions.ADMIN;
      },
      isUserHasPermission: (allowedPermissions: types.Permission[]) => {
        // if user is admin, return true
        const currentUser = get().user;
        if (!currentUser) return false;
        if (get().isAdminRole()) return true;
        return !!currentUser?.permissions?.some((permission) =>
          allowedPermissions.includes(permission as types.Permission)
        );
      },
      isUserHasRole: (allowedRoles: types.UserRole[]) => {
        const currentUser = get().user;
        if (!currentUser) return false;
        if (get().isAdminRole()) return true;
        return allowedRoles.includes(currentUser.role as types.UserRole);
      },
    }),
    {
      name: "user", // key in localStorage
      partialize: (state) => ({ user: state.user }),
    }
  )
);
