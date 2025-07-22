import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = unknown; // TODO: Replace with the actual user type

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
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
