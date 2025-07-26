import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import LoginForm from "@/components/core/Auth/LoginForm";
import { hasLength, isEmail, isNotEmpty, useForm } from "@mantine/form";
import type { LoginFormValues } from "client.types";
import { AxiosError } from "axios";
import api from "@/services/httpConfig";

const LoginPage = () => {
  const loginImage =
    "https://images.unsplash.com/photo-1484242857719-4b9144542727?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1280&q=80";

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
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
              <Zap className="size-4" />
            </div>
            ELeads
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm
              formProps={formProps}
              loading={loading}
              handleSubmit={handleSubmit}
              errorMessage={errorMessage}
            />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src={loginImage}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
};

export default LoginPage;
