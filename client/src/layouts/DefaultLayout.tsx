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
          console.log("response.data in default layout:", response.data);
          setWorkspaceUsers(response.data || []);
        }
      });
    }
  }, [user, setWorkspaceLeads, setWorkspaceUsers]);

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
