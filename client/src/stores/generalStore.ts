import { create } from "zustand";

type generalState = {
  theme: "light" | "dark";
  soonFeatures: Record<string, boolean>; // key is the feature name, value is true if the feature is soon to be released
  newFeatures: Record<string, boolean>; // key is the feature name, value is true if the feature is new
  setTheme: (theme: "light" | "dark") => void;
};

export const useGeneralStore = create<generalState>((set) => ({
  theme: "light",
  soonFeatures: {
    darkMode: true,
    compactView: true,
    notifications: true,
    emailNotifications: true,
    leadUpdatesNotifications: true,
    activityRemindersNotifications: true,
    workspaceChangesNotifications: true,
  },
  newFeatures: {
    darkMode: false,
    compactView: false,
    notifications: false,
    emailNotifications: false,
    leadUpdatesNotifications: false,
    activityRemindersNotifications: false,
    workspaceChangesNotifications: false,
  },
  setTheme: (theme) => set({ theme }),
}));
