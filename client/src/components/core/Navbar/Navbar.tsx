import { useState } from "react";
import { Menu, Typography } from "antd";
import type { MenuProps } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { capitalizeFirstLetter } from "@/utils/utilFunc";
import api from "@/services/httpConfig";

const { Title } = Typography;

type MenuItem = Required<MenuProps>["items"][number];

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname.split("/")[1];
  const [active, setActive] = useState(capitalizeFirstLetter(currentPath));
  const navigate = useNavigate();

  const navItems: MenuItem[] = [
    {
      key: "home",
      label: "Home",
      icon: <HomeOutlined />,
    },
    {
      key: "billing",
      label: "Billing",
      icon: <FileTextOutlined />,
    },
    {
      key: "clients",
      label: "Clients",
      icon: <UserOutlined />,
    },
    {
      key: "leads",
      label: "Leads",
      icon: <TeamOutlined />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
    },
  ];

  const logoutItem: MenuItem[] = [
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      logoutUser();
    } else {
      setActive(e.key);
      navigate(`/${e.key}`);
    }
  };

  const logoutUser = () => {
    api
      .get("/users/logout")
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px", textAlign: "center", borderBottom: "1px solid #f0f0f0" }}>
        <Title level={4} style={{ margin: 0, color: "#1677ff" }}>
          EdgarLeads
        </Title>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[active.toLowerCase()]}
          items={navItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0, flex: 1 }}
        />

        <Menu
          mode="inline"
          items={logoutItem}
          onClick={handleMenuClick}
          style={{ borderRight: 0, marginBottom: 0 }}
          selectable={false}
        />
      </div>
    </div>
  );
};

export default Navbar;
