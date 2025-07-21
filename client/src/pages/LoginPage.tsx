import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Paper,
  Container,
  Button,
  Group,
  Anchor,
  Stack,
  Title,
  Text,
} from "@mantine/core";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate login
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8fafc",
        width: "100%",
      }}
    >
      <Container size={600} style={{ width: "30%", height: "100%" }}>
        <Paper
          withBorder
          shadow="md"
          p={50}
          radius="md"
          style={{
            width: "100%",
            height: "100%",
          }}
        >
          <Stack gap={0} mb="xl">
            <Title order={1} ta="center" mb={10}>
              Welcome Back!
            </Title>
            <Text ta="center" size="sm" color="dimmed">
              Sign in to your account
            </Text>
          </Stack>

          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput
                label="Email"
                placeholder="you@email.com"
                value={email}
                onChange={(event) => setEmail(event.currentTarget.value)}
                required
              />
              <PasswordInput
                label="Password"
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
                required
              />
            </Stack>
            <Group justify="space-between" mt="lg">
              <Anchor href="#" size="sm">
                Forgot password?
              </Anchor>
            </Group>
            <Button fullWidth mt="xl" type="submit" loading={loading}>
              Sign in
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default LoginPage;
