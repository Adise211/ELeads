import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserDTO } from "../../../shared/types";
import type { Permission } from "../../../shared/types/prisma-enums";
import { roleOptions } from "../../../shared/constants";

type AuthState = {
  user: UserDTO | null;
  setUser: (user: UserDTO | null) => void;
  logout: () => void;
  isUserHasPermission: (allowedPermission: Permission[]) => boolean;
};

export const useAuthStore = create<AuthState>()(
  // persist user in local storage
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      isUserHasPermission: (allowedPermission: Permission[]) => {
        // if user is admin, return true
        const currentUser = get().user;
        if (!currentUser) return false;
        if (currentUser.role === roleOptions.ADMIN) return true;
        return !!currentUser?.permissions?.some((permission) =>
          allowedPermission.includes(permission as Permission)
        );
      },
    }),
    {
      name: "user", // key in localStorage
      partialize: (state) => ({ user: state.user }),
    }
  )
);
