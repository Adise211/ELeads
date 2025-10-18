import { createBrowserRouter, Navigate } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import BlankLayout from "@/layouts/BlankLayout";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import ProtectedRoute from "@/components/providers/ProtectedRoute";
import BillingPage from "@/pages/BillingPage";
import ClientsPage from "@/pages/ClientsPage";
import SettingsPage from "@/pages/SettingsPage";
import LeadsPage from "@/pages/LeadsPage";
import ErrorPage from "@/pages/ErrorPage";
import SignupPage from "@/pages/SignupPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
    children: [
      { index: true, element: <Navigate to="/home" /> },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        ),
      },
      {
        path: "billing",
        element: (
          <ProtectedRoute>
            <BillingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "clients",
        element: (
          <ProtectedRoute>
            <ClientsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "leads",
        element: (
          <ProtectedRoute>
            <LeadsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <BlankLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: "/signup",
    element: <BlankLayout />,
    children: [{ index: true, element: <SignupPage /> }],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;
