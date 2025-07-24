import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/services/httpConfig";
import Login from "@/components/core/Auth/Login/Login";
import { AxiosError } from "axios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.post("/users/login", { email, password });
      if (response.data.success) {
        navigate("/home");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data.message);
      } else {
        console.error(error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Login
      email={email}
      password={password}
      loading={loading}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleSubmit}
    />
  );
};

export default LoginPage;
