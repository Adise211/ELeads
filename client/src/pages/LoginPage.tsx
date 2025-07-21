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
    <Container size={600} my={40}>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
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
  );
};

export default LoginPage;
