import { Input, Avatar, Dropdown, Badge } from "antd";
import type { MenuProps } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined, BellOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "@/services/httpConfig";
import styles from "./TopMenu.module.css";

const { Search } = Input;

type MenuItem = Required<MenuProps>["items"][number];

const TopMenu = () => {
  const navigate = useNavigate();

  const userMenuItems: MenuItem[] = [
    {
      key: "profile",
      label: "Profile",
      icon: <UserOutlined />,
    },
    {
      key: "settings",
      label: "Settings",
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <LogoutOutlined />,
    },
  ];

  const handleUserMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "logout") {
      logoutUser();
    } else if (e.key === "profile") {
      navigate("/profile");
    } else if (e.key === "settings") {
      navigate("/settings");
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

  const onSearch = (value: string) => {
    console.log("Search:", value);
  };

  return (
    <div className={styles.topMenuContainer}>
      <div className={styles.searchContainer}>
        <Search
          placeholder="Search..."
          onSearch={onSearch}
          style={{ width: "100%" }}
          size="middle"
        />
      </div>

      <div className={styles.actionsContainer}>
        <Badge count={3} size="small">
          <BellOutlined className={styles.notificationIcon} />
        </Badge>

        <Dropdown
          menu={{ items: userMenuItems, onClick: handleUserMenuClick }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Avatar size="default" icon={<UserOutlined />} className={styles.userAvatar} />
        </Dropdown>
      </div>
    </div>
  );
};

export default TopMenu;
