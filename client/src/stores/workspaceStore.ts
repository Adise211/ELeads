import type { LeadDTO, UserDTO } from "@eleads/shared";
import { create } from "zustand";

type WorkspaceState = {
  workspaceLeads: LeadDTO[];
  setWorkspaceLeads: (workspaceLeads: LeadDTO[]) => void;
  workspaceUsers: UserDTO[];
  setWorkspaceUsers: (workspaceUsers: UserDTO[]) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaceLeads: [],
  setWorkspaceLeads: (workspaceLeads) => set({ workspaceLeads }),
  workspaceUsers: [],
  setWorkspaceUsers: (workspaceUsers) => set({ workspaceUsers }),
}));
