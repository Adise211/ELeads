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
  const firstName = user?.firstName || "Guest";
  const lastName = user?.lastName || "Guest";
  const placeholderAvatar = `https://ui-avatars.com/api/?name=${firstName}+${lastName}`;

  const navItems = {
    user: {
      name: firstName + " " + lastName,
      email: user?.email || "guest@example.com",
      avatar: user?.avatarUrl || placeholderAvatar,
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
