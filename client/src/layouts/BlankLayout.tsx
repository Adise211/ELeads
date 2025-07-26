// import type { ReactNode } from "react";
import { Outlet } from "react-router-dom";

const BlankLayout = () => {
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
      }}
    >
      <Outlet />
    </div>
  );
};

export default BlankLayout;
