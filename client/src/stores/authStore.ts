import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserDTO } from "../../../shared/types";

type AuthState = {
  user: UserDTO | null;
  setUser: (user: UserDTO | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  // persist user in local storage
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "user", // key in localStorage
      partialize: (state) => ({ user: state.user }),
    }
  )
);
