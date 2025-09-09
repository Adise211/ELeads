import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideNavbar from "@/components/core/Navbar/SideNavbar";
import { Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";
import { workspaceService } from "@/services";
import { useWorkspaceStore } from "@/stores/workspaceStore";

export default function DefaultLayout() {
  const { user } = useAuthStore();
  const setWorkspaceLeads = useWorkspaceStore((state) => state.setWorkspaceLeads);
  const setWorkspaceUsers = useWorkspaceStore((state) => state.setWorkspaceUsers);
  const setWorkspaceBillings = useWorkspaceStore((state) => state.setWorkspaceBillings);
  const setWorkspaceClients = useWorkspaceStore((state) => state.setWorkspaceClients);

  useEffect(() => {
    if (user) {
      // get workspace leads
      workspaceService.getWorkspaceLeads().then((response) => {
        if (response.success) {
          setWorkspaceLeads(response.data || []);
        }
      });
      // get workspace users
      workspaceService.getWorkspaceUsers().then((response) => {
        if (response.success) {
          setWorkspaceUsers(response.data || []);
        }
      });
      // get workspace billings
      workspaceService.getWorkspaceBillings().then((response) => {
        if (response.success) {
          setWorkspaceBillings(response.data || []);
        }
      });
      // get workspace clients
      workspaceService.getWorkspaceClients().then((response) => {
        if (response.success) {
          setWorkspaceClients(response.data || []);
        }
      });
    }
  }, [user, setWorkspaceLeads, setWorkspaceUsers, setWorkspaceBillings, setWorkspaceClients]);

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
