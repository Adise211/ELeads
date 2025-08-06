import { Navigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { authService } from "@/services";
import { useAuthStore } from "@/stores/authStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<null | boolean>(null);
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  // check if user is authorized
  useEffect(() => {
    authService
      .getCurrentUser()
      .then((response) => {
        // user is authorized
        if (response.success) {
          setIsAuthorized(true);
          setUser(response.data?.user || null);
        } else {
          setIsAuthorized(false);
          clearUser();
        }
      })
      .catch(() => {
        // user is not authorized
        setIsAuthorized(false);
        // logout user (remove user from local storage)
        clearUser();
      });
  }, []);

  // if user is not authorized, redirect to login page
  if (isAuthorized === null) return null;
  if (!isAuthorized) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export default ProtectedRoute;
