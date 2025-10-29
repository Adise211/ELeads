import * as React from "react";
// import Logo from "@/assets/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Zap } from "lucide-react";
import { NavSecondary } from "./NavSecondry";
import { NavUser } from "./NavUser";
import { NavMain } from "./NavMain";
import { useNavItems } from "./navItems";
import { SupportFeedbackDialog, type DialogType } from "../SupportFeedbackDialog";

function SideNavbar() {
  const navItems = useNavItems();
  const [dialogState, setDialogState] = React.useState<{
    isOpen: boolean;
    type: DialogType | null;
  }>({
    isOpen: false,
    type: null,
  });

  const handleSupportClick = () => {
    setDialogState({ isOpen: true, type: "support" });
  };

  const handleFeedbackClick = () => {
    setDialogState({ isOpen: true, type: "feedback" });
  };

  const handleDialogClose = () => {
    setDialogState({ isOpen: false, type: null });
  };

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="/home">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Zap className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">ELeads</span>
                    <span className="truncate text-xs">Leads Management</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <NavMain items={navItems.navMain} />
          <NavSecondary
            items={navItems.navSecondary}
            className="mt-auto"
            onSupportClick={handleSupportClick}
            onFeedbackClick={handleFeedbackClick}
          />
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={navItems.user} />
        </SidebarFooter>
      </Sidebar>

      {dialogState.type && (
        <SupportFeedbackDialog
          isOpen={dialogState.isOpen}
          onClose={handleDialogClose}
          type={dialogState.type}
        />
      )}
    </>
  );
}

export default SideNavbar;
