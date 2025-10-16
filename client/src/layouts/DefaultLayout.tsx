import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideNavbar from "@/components/core/Navbar/SideNavbar";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { workspaceService } from "@/services";
import { useWorkspaceStore } from "@/stores/workspaceStore";
import { useUserDataStore } from "@/stores/userDataStore";
import { types } from "@eleads/shared";

export default function DefaultLayout() {
  const { user } = useAuthStore();
  const setWorkspaceLeads = useWorkspaceStore((state) => state.setWorkspaceLeads);
  const setWorkspaceUsers = useWorkspaceStore((state) => state.setWorkspaceUsers);
  const setWorkspaceBillings = useWorkspaceStore((state) => state.setWorkspaceBillings);
  const setWorkspaceClients = useWorkspaceStore((state) => state.setWorkspaceClients);
  const setUserLeads = useUserDataStore((state) => state.setUserLeads);
  const setUserClients = useUserDataStore((state) => state.setUserClients);
  const setUserBillings = useUserDataStore((state) => state.setUserBillings);
  const setUserTotalRevenue = useUserDataStore((state) => state.setUserTotalRevenue);
  const setWorkspaceTotalRevenue = useWorkspaceStore((state) => state.setWorkspaceTotalRevenue);

  useEffect(() => {
    if (user) {
      function getLeads() {
        // get workspace leads
        workspaceService.getWorkspaceLeads().then((response) => {
          if (response.success) {
            // set workspace leads
            setWorkspaceLeads(response.data || []);

            // set user leads
            const userLeads =
              response.data?.filter((lead: types.LeadDTO) => lead.assignedToId === user?.id) || [];

            setUserLeads(userLeads || []);
          }
        });
      }

      function getUsers() {
        // get workspace users
        workspaceService.getWorkspaceUsers().then((response) => {
          if (response.success) {
            setWorkspaceUsers(response.data || []);
          }
        });
      }

      function getBillingsAndRevenue() {
        // get workspace billings
        workspaceService.getWorkspaceBillings().then((response) => {
          if (response.success) {
            // set workspace billings
            setWorkspaceBillings(response.data || []);

            const paidBillings =
              response.data?.filter(
                (billing: types.BillingDTO) => billing.billingStatus === types.BillingStatus.PAID
              ) || [];
            // TODO: Move it to the store
            // set workspace total revenue - calculated from billed amount and billing status (paid only)
            const workspaceTotalRevenue =
              paidBillings.reduce(
                (sum: number, billing: types.BillingDTO) => sum + Number(billing.billedAmount),
                0
              ) || 0;
            setWorkspaceTotalRevenue(workspaceTotalRevenue);

            // set user billings
            const userBillings =
              response.data?.filter(
                (billing: types.BillingDTO) => billing?.client?.assignedToId === user?.id
              ) || [];
            setUserBillings(userBillings || []);

            // convert commission to decimal number
            const convertCommissionToNumber = (commission: number | string) => {
              return Number(commission) / 100;
            };

            // get user total revenue - calculated from billed amount and user commission
            const userTotalRevenue = paidBillings.reduce(
              (acc: number, billing: types.BillingDTO) =>
                acc + billing.billedAmount * convertCommissionToNumber(billing.userCommission),
              0
            );
            setUserTotalRevenue(userTotalRevenue);
          }
        });
      }

      function getClients() {
        // get workspace clients
        workspaceService.getWorkspaceClients().then((response) => {
          if (response.success) {
            // set workspace clients
            setWorkspaceClients(response.data || []);

            // set user clients
            const userClients =
              response.data?.filter(
                (client: types.ClientDTO) => client?.assignedToId === user?.id
              ) || [];
            setUserClients(userClients || []);
          }
        });
      }

      getLeads();
      getUsers();
      getBillingsAndRevenue();
      getClients();
    }
  }, [
    user,
    setWorkspaceLeads,
    setWorkspaceUsers,
    setWorkspaceBillings,
    setWorkspaceClients,
    setUserLeads,
    setUserClients,
    setUserBillings,
    setUserTotalRevenue,
    setWorkspaceTotalRevenue,
  ]);

  return (
    <SidebarProvider>
      <SideNavbar />
      <main className="w-full">
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
