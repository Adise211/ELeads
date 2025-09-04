import { types } from "@eleads/shared";
import { create } from "zustand";

type WorkspaceState = {
  workspaceLeads: types.LeadDTO[];
  workspaceUsers: types.UserDTO[];
  workspaceBillings: types.BillingDTO[];
  workspaceClients: types.ClientDTO[];
  setWorkspaceLeads: (workspaceLeads: types.LeadDTO[]) => void;
  setWorkspaceUsers: (workspaceUsers: types.UserDTO[]) => void;
  setWorkspaceBillings: (workspaceBillings: types.BillingDTO[]) => void;
  setWorkspaceClients: (workspaceClients: types.ClientDTO[]) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaceLeads: [],
  workspaceUsers: [],
  workspaceBillings: [],
  workspaceClients: [],
  setWorkspaceLeads: (workspaceLeads) => set({ workspaceLeads }),
  setWorkspaceUsers: (workspaceUsers) => set({ workspaceUsers }),
  setWorkspaceBillings: (workspaceBillings) => set({ workspaceBillings }),
  setWorkspaceClients: (workspaceClients) => set({ workspaceClients }),
}));
