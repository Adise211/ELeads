import {
  Anchor,
  Button,
  Checkbox,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import classes from "./Login.module.css";
import type { UseFormReturnType } from "@mantine/form";
import type { LoginFormValues } from "@/../client.types";

type LoginProps = {
  formProps: UseFormReturnType<LoginFormValues>;
  loading: boolean;
  handleSubmit: (values: LoginFormValues) => void;
};

export function Login({ loading, formProps, handleSubmit }: LoginProps) {
  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form}>
        <Title order={2} className={classes.title}>
          Welcome back to ELeads!
        </Title>
        <form onSubmit={formProps.onSubmit(handleSubmit)}>
          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            radius="md"
            {...formProps.getInputProps("email")}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            radius="md"
            {...formProps.getInputProps("password")}
          />
          <Checkbox label="Keep me logged in" mt="xl" size="md" />
          <Button fullWidth mt="xl" size="md" radius="md" loading={loading} type="submit">
            Login
          </Button>

          <Text ta="center" mt="md">
            Don&apos;t have an account?{" "}
            <Anchor href="#" fw={500} onClick={(event) => event.preventDefault()}>
              Register
            </Anchor>
          </Text>
        </form>
      </Paper>
    </div>
  );
}

export default Login;
