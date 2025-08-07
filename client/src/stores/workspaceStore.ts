import type { LeadDTO } from "@eleads/shared";
import { create } from "zustand";

type WorkspaceState = {
  workspaceLeads: LeadDTO[];
  setWorkspaceLeads: (workspaceLeads: LeadDTO[]) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaceLeads: [],
  setWorkspaceLeads: (workspaceLeads) => set({ workspaceLeads }),
}));
