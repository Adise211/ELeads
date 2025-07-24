import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/httpConfig";
import Login from "@/components/core/Auth/Login/Login";
import { AxiosError } from "axios";
import { isEmail, isNotEmpty, hasLength, useForm } from "@mantine/form";
import type { LoginFormValues } from "../../client.types";

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const formProps = useForm<LoginFormValues>({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => {
        return isNotEmpty("Email is required")(value) || isEmail("Invalid email")(value);
      },
      password: (value) => {
        return (
          isNotEmpty("Password is required")(value) ||
          hasLength({ min: 6 }, "Password must be at least 6 characters long")(value)
        );
      },
    },
  });

  useEffect(() => {
    // check if user is logged in
    api
      .get("/users/me")
      .then((res) => {
        if (res.data?.user) {
          navigate("/home");
        }
      })
      .catch(() => {
        // Not logged in, do nothing
      });
  }, [navigate]);

  const handleSubmit = async (values: typeof formProps.values) => {
    setLoading(true);
    try {
      const response = await api.post("/users/login", {
        email: values.email,
        password: values.password,
      });
      if (response.data.success) {
        navigate("/home");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
        setErrorMessage(error.response?.data.message);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Login
      formProps={formProps}
      loading={loading}
      handleSubmit={handleSubmit}
      errorMessage={errorMessage}
    />
  );
};

export default LoginPage;
