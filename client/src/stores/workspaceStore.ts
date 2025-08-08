import { types } from "@eleads/shared";
import { create } from "zustand";

type WorkspaceState = {
  workspaceLeads: types.LeadDTO[];
  setWorkspaceLeads: (workspaceLeads: types.LeadDTO[]) => void;
  workspaceUsers: types.UserDTO[];
  setWorkspaceUsers: (workspaceUsers: types.UserDTO[]) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaceLeads: [],
  setWorkspaceLeads: (workspaceLeads) => set({ workspaceLeads }),
  workspaceUsers: [],
  setWorkspaceUsers: (workspaceUsers) => set({ workspaceUsers }),
}));
