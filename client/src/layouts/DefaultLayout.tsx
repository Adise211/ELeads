import Navbar from "../components/core/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const DefaultLayout = () => {
  return (
    <div style={{ height: "100vh", width: "100vw", display: "flex" }}>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
