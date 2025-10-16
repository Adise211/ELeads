import { types } from "@eleads/shared";
import { create } from "zustand";

type userDataState = {
  userLeads: types.LeadDTO[];
  userClients: types.ClientDTO[];
  userBillings: types.BillingDTO[];
  userTotalRevenue: number;
  setUserLeads: (userLeads: types.LeadDTO[]) => void;
  setUserClients: (userClients: types.ClientDTO[]) => void;
  setUserBillings: (userBillings: types.BillingDTO[]) => void;
  setUserTotalRevenue: (userTotalRevenue: number) => void;
};

export const useUserDataStore = create<userDataState>((set) => ({
  userLeads: [],
  userClients: [],
  userBillings: [],
  userTotalRevenue: 0,
  setUserLeads: (userLeads) => set({ userLeads }),
  setUserClients: (userClients) => set({ userClients }),
  setUserBillings: (userBillings) => set({ userBillings }),
  setUserTotalRevenue: (userTotalRevenue) => set({ userTotalRevenue }),
}));
