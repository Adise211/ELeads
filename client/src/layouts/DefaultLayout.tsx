import Navbar from "@/components/core/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex" }}>
      <Navbar />
      <div
        className="main-content"
        style={{
          width: "100%",
          height: "100%",
          padding: "50px",
          overflow: "auto",
          background: "var(--mantine-color-gray-0)",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;
