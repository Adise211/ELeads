import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import SideNavbar from "@/components/core/Navbar/SideNavbar";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <SidebarProvider>
      <SideNavbar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}
