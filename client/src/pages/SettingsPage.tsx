import { Text, Avatar, Tabs, Paper, Divider, Box, Stack } from "@mantine/core";
import { useState } from "react";

const SettingsPage = () => {
  const [email] = useState("johndoe@email.com");
  const [name] = useState("John Doe");

  return (
    <Box
      style={{
        height: "100%",
        background: "var(--mantine-color-gray-0)",
        width: "100%",
      }}
    >
      <Stack align="center" justify="center" style={{ height: "100%" }}>
        {/* Top Card: User Info */}
        <Paper
          shadow="xl"
          radius="md"
          p="xl"
          style={{
            flex: "0 0 40%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Avatar size={80} radius="xl" src={null} alt={name} color="blue" mb="md">
            {name[0]}
          </Avatar>
          <Text ta="center" size="lg" fw={500}>
            {name}
          </Text>
          <Text ta="center" color="dimmed" size="sm">
            {email}
          </Text>
        </Paper>
        {/* Bottom Card: Tabs */}
        <Paper
          shadow="xl"
          radius="md"
          p="xl"
          style={{
            flex: "0 0 60%",
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
            overflow: "hidden",
            width: "100%",
          }}
        >
          <Tabs defaultValue="account" variant="pills" keepMounted={false}>
            <Tabs.List grow>
              <Tabs.Tab value="account">Account</Tabs.Tab>
              <Tabs.Tab value="permissions">Permissions</Tabs.Tab>
              <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
            </Tabs.List>
            <Divider my="md" />
            <Tabs.Panel value="account">
              <Text ta="center" c="dimmed">
                Account settings go here.
              </Text>
            </Tabs.Panel>
            <Tabs.Panel value="permissions">
              <Text ta="center" c="dimmed">
                Permissions settings go here.
              </Text>
            </Tabs.Panel>
            <Tabs.Panel value="notifications">
              <Text ta="center" c="dimmed">
                Notification settings go here.
              </Text>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Stack>
    </Box>
  );
};

export default SettingsPage;
