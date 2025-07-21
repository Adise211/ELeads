// import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

const BlankLayout = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Outlet />
    </div>
  );
};

export default BlankLayout;
