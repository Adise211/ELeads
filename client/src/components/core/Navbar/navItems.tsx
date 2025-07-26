import {
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings,
  Frame,
  Home,
  Users,
  BriefcaseBusiness,
  Receipt,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export const useNavItems = () => {
  const user = useAuthStore((state) => state.user);

  const navItems = {
    user: {
      name: user?.firstName + " " + user?.lastName || "Guest",
      email: user?.email || "guest@example.com",
      avatar: "", // TODO:UserDTO doesn't have avatar property
    },
    navMain: [
      {
        title: "Home",
        url: "/home",
        icon: Home,
        isActive: true,
      },
      {
        title: "Clients",
        url: "/clients",
        icon: Users,
      },
      {
        title: "Leads",
        url: "/leads",
        icon: BriefcaseBusiness,
      },
      {
        title: "Billing",
        url: "/billing",
        icon: Receipt,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };
  return navItems;
};
