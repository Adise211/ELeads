import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavSecondary({
  items,
  onSupportClick,
  onFeedbackClick,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
  onSupportClick?: () => void;
  onFeedbackClick?: () => void;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const handleItemClick = (item: { title: string; url: string }) => {
    if (item.title === "Support" && onSupportClick) {
      onSupportClick();
    } else if (item.title === "Feedback" && onFeedbackClick) {
      onFeedbackClick();
    }
  };

  const isDialogItem = (title: string) => {
    return title === "Support" || title === "Feedback";
  };

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {isDialogItem(item.title) ? (
                <SidebarMenuButton size="sm" onClick={() => handleItemClick(item)}>
                  <item.icon />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton asChild size="sm">
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
