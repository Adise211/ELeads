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
import api from "@/services/httpConfig";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/users/login", {
        email,
        password,
      });
      if (response.data.success) {
        // Redirect to home page
        navigate("/home");
      }
    } catch (error) {
      // error is handled globally in httpConfig.ts
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      <Container size={450} style={{ width: "100%", height: "100%" }}>
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
