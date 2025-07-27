import { LifeBuoy, Send, Settings, Home, Users, BriefcaseBusiness, Receipt } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useLocation } from "react-router-dom";

export const useNavItems = () => {
  const user = useAuthStore((state) => state.user);
  const firstName = user?.firstName || "Guest";
  const lastName = user?.lastName || "Guest";
  const placeholderAvatar = `https://ui-avatars.com/api/?name=${firstName}+${lastName}`;
  const location = useLocation();
  const setIsActive = (url: string) => {
    return location.pathname === url;
  };

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
        isActive: setIsActive("/home"),
      },
      {
        title: "Clients",
        url: "/clients",
        icon: Users,
        isActive: setIsActive("/clients"),
      },
      {
        title: "Leads",
        url: "/leads",
        icon: BriefcaseBusiness,
        isActive: setIsActive("/leads"),
      },
      {
        title: "Billing",
        url: "/billing",
        icon: Receipt,
        isActive: setIsActive("/billing"),
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        isActive: setIsActive("/settings"),
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
        isActive: setIsActive("/support"),
      },
      {
        title: "Feedback",
        url: "#",
        icon: Send,
        isActive: setIsActive("/feedback"),
      },
    ],
  };
  return navItems;
};
