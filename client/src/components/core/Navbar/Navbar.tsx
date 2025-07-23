import { useState } from "react";
// import {
//   Icon2fa,
//   IconBellRinging,
//   IconDatabaseImport,
//   IconFingerprint,
//   IconKey,
//   IconLogout,
//   IconReceipt2,
//   IconSettings,
//   IconSwitchHorizontal,
// } from "@tabler/icons-react";
import { Code, Group } from "@mantine/core";
import classes from "./Navbar.module.css";
import IconLogout from "@/assets/icons/IconLogout";
import IconHome from "@/assets/icons/IconHome";
import IconReciept from "@/assets/icons/IconReciept";
import IconOffice from "@/assets/icons/IconOffice";
import IconBriefcase from "@/assets/icons/IconBriefcase";
import IconSettings from "@/assets/icons/IconSettings";
import api from "@/services/httpConfig";
import { useNavigate } from "react-router-dom";

const data = [
  { link: "/home", label: "Home", icon: IconHome },
  { link: "/billing", label: "Billing", icon: IconReciept },
  { link: "/clients", label: "Clients", icon: IconOffice },
  { link: "/leads", label: "Leads", icon: IconBriefcase },
  { link: "/settings", label: "Settings", icon: IconSettings },
];

const Navbar = () => {
  const [active, setActive] = useState("Home");
  const navigate = useNavigate();

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
        navigate(item.link); // This will change the route
      }}
    >
      {item.icon && <item.icon className={classes.linkIcon} />}
      <span>{item.label}</span>
    </a>
  ));

  const logoutUser = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
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
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          {/* <MantineLogo size={28} /> */}
          <Code fw={700}>v3.1.2</Code>
        </Group>
        {links}
      </div>

      <div className={classes.footer}>
        {/* <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </a> */}

        <a href="#" className={classes.link} onClick={(event) => logoutUser(event)}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
