import { create } from "zustand";

type generalState = {
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
};

export const useGeneralStore = create<generalState>((set) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
}));
