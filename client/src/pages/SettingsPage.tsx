import {
  Container,
  Card,
  Avatar,
  Text,
  Group,
  Badge,
  Tabs,
  Grid,
  Stack,
  Button,
  TextInput,
  Select,
  Switch,
  Divider,
} from "@mantine/core";

// Mock user data
const mockUser = {
  name: "John Doe",
  email: "john.doe@company.com",
  role: "Admin",
  memberSince: "January 2022",
  lastUpdated: "2 hours ago",
  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face",
};

const SettingsPage = () => {
  return (
    <div className="min-h-[calc(100vh-3rem)] bg-gray-50">
      <Container size="md" py="xl">
        <Stack gap="xl">
          {/* User Info Card */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Text size="lg" fw={600}>
                User Information
              </Text>
              <Button variant="light" size="sm">
                Edit Profile
              </Button>
            </Group>

            <Grid>
              <Grid.Col span={{ base: 12, sm: 4 }}>
                <Stack align="center" gap="sm">
                  <Avatar src={mockUser.avatar} size={120} radius="md" />
                  <Badge color="blue" variant="light">
                    {mockUser.role}
                  </Badge>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, sm: 8 }}>
                <Stack gap="md">
                  <Group>
                    <div>
                      <Text size="sm" c="dimmed">
                        Full Name
                      </Text>
                      <Text fw={500}>{mockUser.name}</Text>
                    </div>
                  </Group>

                  <Group>
                    <div>
                      <Text size="sm" c="dimmed">
                        Email Address
                      </Text>
                      <Text fw={500}>{mockUser.email}</Text>
                    </div>
                  </Group>

                  <Group>
                    <div>
                      <Text size="sm" c="dimmed">
                        Member Since
                      </Text>
                      <Text fw={500}>{mockUser.memberSince}</Text>
                    </div>
                  </Group>

                  <Group>
                    <div>
                      <Text size="sm" c="dimmed">
                        Last Updated
                      </Text>
                      <Text fw={500}>{mockUser.lastUpdated}</Text>
                    </div>
                  </Group>
                </Stack>
              </Grid.Col>
            </Grid>
          </Card>

          {/* Settings Card with Tabs */}
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Tabs defaultValue="account">
              <Tabs.List>
                <Tabs.Tab value="account">Account</Tabs.Tab>
                <Tabs.Tab value="permissions">Permissions</Tabs.Tab>
                <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="account" pt="xl">
                <Stack gap="md">
                  <Text size="lg" fw={600} mb="md">
                    Account Settings
                  </Text>

                  <Grid>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="First Name"
                        placeholder="Enter your first name"
                        defaultValue="John"
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, sm: 6 }}>
                      <TextInput
                        label="Last Name"
                        placeholder="Enter your last name"
                        defaultValue="Doe"
                      />
                    </Grid.Col>
                  </Grid>

                  <TextInput
                    label="Email Address"
                    placeholder="Enter your email"
                    defaultValue={mockUser.email}
                  />

                  <Select
                    label="Time Zone"
                    placeholder="Select your time zone"
                    data={[
                      "UTC-8 (Pacific Time)",
                      "UTC-5 (Eastern Time)",
                      "UTC+0 (Greenwich Mean Time)",
                      "UTC+1 (Central European Time)",
                    ]}
                    defaultValue="UTC-5 (Eastern Time)"
                  />

                  <Select
                    label="Language"
                    placeholder="Select your language"
                    data={["English", "Spanish", "French", "German", "Italian"]}
                    defaultValue="English"
                  />

                  <Group justify="flex-end" pt="md">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </Group>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="permissions" pt="xl">
                <Stack gap="md">
                  <Text size="lg" fw={600} mb="md">
                    User Permissions
                  </Text>

                  <Card withBorder p="md">
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Admin Access</Text>
                        <Text size="sm" c="dimmed">
                          Full system administration rights
                        </Text>
                      </div>
                      <Switch defaultChecked />
                    </Group>
                  </Card>

                  <Card withBorder p="md">
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>User Management</Text>
                        <Text size="sm" c="dimmed">
                          Create, edit, and delete user accounts
                        </Text>
                      </div>
                      <Switch defaultChecked />
                    </Group>
                  </Card>

                  <Card withBorder p="md">
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Content Management</Text>
                        <Text size="sm" c="dimmed">
                          Manage and moderate content
                        </Text>
                      </div>
                      <Switch />
                    </Group>
                  </Card>

                  <Card withBorder p="md">
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>Analytics Access</Text>
                        <Text size="sm" c="dimmed">
                          View system analytics and reports
                        </Text>
                      </div>
                      <Switch defaultChecked />
                    </Group>
                  </Card>

                  <Card withBorder p="md">
                    <Group justify="space-between">
                      <div>
                        <Text fw={500}>API Access</Text>
                        <Text size="sm" c="dimmed">
                          Access to system APIs and integrations
                        </Text>
                      </div>
                      <Switch />
                    </Group>
                  </Card>

                  <Group justify="flex-end" pt="md">
                    <Button variant="outline">Reset to Default</Button>
                    <Button>Update Permissions</Button>
                  </Group>
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="notifications" pt="xl">
                <Stack gap="md">
                  <Text size="lg" fw={600} mb="md">
                    Notification Preferences
                  </Text>

                  <div>
                    <Text fw={500} mb="sm">
                      Email Notifications
                    </Text>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text size="sm">Security alerts</Text>
                        <Switch defaultChecked />
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Account updates</Text>
                        <Switch defaultChecked />
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Marketing emails</Text>
                        <Switch />
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Weekly digest</Text>
                        <Switch defaultChecked />
                      </Group>
                    </Stack>
                  </div>

                  <Divider />

                  <div>
                    <Text fw={500} mb="sm">
                      Push Notifications
                    </Text>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text size="sm">Important system updates</Text>
                        <Switch defaultChecked />
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Task reminders</Text>
                        <Switch defaultChecked />
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Team mentions</Text>
                        <Switch defaultChecked />
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">New messages</Text>
                        <Switch />
                      </Group>
                    </Stack>
                  </div>

                  <Divider />

                  <div>
                    <Text fw={500} mb="sm">
                      SMS Notifications
                    </Text>
                    <Stack gap="sm">
                      <Group justify="space-between">
                        <Text size="sm">Critical security alerts</Text>
                        <Switch defaultChecked />
                      </Group>
                      <Group justify="space-between">
                        <Text size="sm">Login notifications</Text>
                        <Switch />
                      </Group>
                    </Stack>
                  </div>

                  <Group justify="flex-end" pt="md">
                    <Button variant="outline">Reset to Default</Button>
                    <Button>Save Preferences</Button>
                  </Group>
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Card>
        </Stack>
      </Container>
    </div>
  );
};

export default SettingsPage;
