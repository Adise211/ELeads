import { types } from "@eleads/shared";
import { create } from "zustand";

type WorkspaceState = {
  workspaceLeads: types.LeadDTO[];
  workspaceUsers: types.UserDTO[];
  workspaceBillings: types.BillingDTO[];
  workspaceClients: types.ClientDTO[];
  workspaceTotalRevenue: number;
  setWorkspaceLeads: (workspaceLeads: types.LeadDTO[]) => void;
  setWorkspaceUsers: (workspaceUsers: types.UserDTO[]) => void;
  setWorkspaceBillings: (workspaceBillings: types.BillingDTO[]) => void;
  setWorkspaceClients: (workspaceClients: types.ClientDTO[]) => void;
  setWorkspaceTotalRevenue: (workspaceTotalRevenue: number) => void;
};

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  workspaceLeads: [],
  workspaceUsers: [],
  workspaceBillings: [],
  workspaceClients: [],
  workspaceTotalRevenue: 0,
  setWorkspaceLeads: (workspaceLeads) => set({ workspaceLeads }),
  setWorkspaceUsers: (workspaceUsers) => set({ workspaceUsers }),
  setWorkspaceBillings: (workspaceBillings) => set({ workspaceBillings }),
  setWorkspaceClients: (workspaceClients) => set({ workspaceClients }),
  setWorkspaceTotalRevenue: (workspaceTotalRevenue) => set({ workspaceTotalRevenue }),
}));
