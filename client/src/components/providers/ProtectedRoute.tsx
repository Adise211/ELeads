import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "@/services/httpConfig";
import { useAuthStore } from "@/stores/authStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<null | boolean>(null);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  // check if user is authorized
  useEffect(() => {
    api
      .get("/users/me")
      .then((response) => {
        // user is authorized
        setIsAuthorized(true);
        setUser(response.data.user || null);
      })
      .catch(() => {
        // user is not authorized
        setIsAuthorized(false);
        // logout user (remove user from local storage)
        logout();
      });
  }, []);

  // if user is not authorized, redirect to login page
  if (isAuthorized === null) return null;
  if (!isAuthorized) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
