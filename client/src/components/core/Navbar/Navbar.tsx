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

const data = [
  { link: "", label: "Home", icon: IconHome },
  { link: "", label: "Billing", icon: IconReciept },
  { link: "", label: "Clients", icon: IconOffice },
  { link: "", label: "Leads", icon: IconBriefcase },
  { link: "", label: "Settings", icon: IconSettings },
];

const Navbar = () => {
  const [active, setActive] = useState("Billing");

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault();
        setActive(item.label);
      }}
    >
      {item.icon && <item.icon className={classes.linkIcon} />}
      <span>{item.label}</span>
    </a>
  ));

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

        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
