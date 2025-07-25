import Navbar from "@/components/core/Navbar/Navbar";
import TopMenu from "@/components/core/TopMenu/TopMenu";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";

const { Sider, Header, Content } = Layout;

const DefaultLayout = () => {
  return (
    <Layout style={{ height: "100vh", width: "100vw" }}>
      <Sider
        width={300}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <Navbar />
      </Sider>
      <Layout>
        <Header
          style={{
            background: "#fff",
            borderBottom: "1px solid #f0f0f0",
            padding: 0,
            height: "64px",
            lineHeight: "64px",
          }}
        >
          <TopMenu />
        </Header>
        <Content
          style={{
            padding: "24px",
            overflow: "auto",
            background: "#f8f9fa",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DefaultLayout;
