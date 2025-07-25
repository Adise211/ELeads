import { Card, Avatar, Typography, Tabs, Divider, Button, Row, Col } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { TabPane } = Tabs;

const mockUser = {
  name: "John Doe",
  email: "johndoe@email.com",
  role: "Admin",
  memberSince: "Jan 2023",
  lastUpdate: "Jul 2024",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
};

const Settings = () => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "#f8f9fa",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
        {/* User Info Card */}
        <Card
          style={{
            flex: "0 0 40%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            marginBottom: 24,
            padding: 0,
            position: "relative",
            background: "#fff",
          }}
          bodyStyle={{
            width: "100%",
            padding: 32,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            type="default"
            icon={<EditOutlined />}
            style={{ position: "absolute", top: 24, right: 24, zIndex: 1 }}
          >
            Edit Profile
          </Button>
          <Avatar
            size={80}
            icon={<UserOutlined />}
            style={{ backgroundColor: "#228be6", marginBottom: 16, fontSize: 40 }}
          >
            {mockUser.name[0]}
          </Avatar>
          <Text strong style={{ fontSize: 18, marginBottom: 4, textAlign: "center" }}>
            {mockUser.name}
          </Text>
          <Text type="secondary" style={{ marginBottom: 12, textAlign: "center" }}>
            {mockUser.email}
          </Text>
          <Divider style={{ margin: "12px 0 16px 0" }} />
          <div
            style={{
              width: "100%",
              maxWidth: 280,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <Row justify="space-between" align="middle">
              <Col>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Role
                </Text>
              </Col>
              <Col>
                <Text strong style={{ color: "#1677ff" }}>
                  {mockUser.role}
                </Text>
              </Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Member since
                </Text>
              </Col>
              <Col>
                <Text>{mockUser.memberSince}</Text>
              </Col>
            </Row>
            <Row justify="space-between" align="middle">
              <Col>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  Last update
                </Text>
              </Col>
              <Col>
                <Text>{mockUser.lastUpdate}</Text>
              </Col>
            </Row>
          </div>
        </Card>
        {/* Settings Tabs Card */}
        <Card
          style={{
            flex: "0 0 60%",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
            borderRadius: 16,
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            background: "#fff",
          }}
          bodyStyle={{
            width: "100%",
            padding: 32,
            flex: 1,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Tabs defaultActiveKey="account" style={{ width: "100%" }}>
            <TabPane tab="Account" key="account">
              <Text type="secondary" style={{ textAlign: "center", display: "block" }}>
                Account settings go here.
              </Text>
            </TabPane>
            <TabPane tab="Permissions" key="permissions">
              <Text type="secondary" style={{ textAlign: "center", display: "block" }}>
                Permissions settings go here.
              </Text>
            </TabPane>
            <TabPane tab="Notifications" key="notifications">
              <Text type="secondary" style={{ textAlign: "center", display: "block" }}>
                Notification settings go here.
              </Text>
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
