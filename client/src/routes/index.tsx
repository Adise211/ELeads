import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "@/layouts/DefaultLayout";
import BlankLayout from "@/layouts/BlankLayout";
import LoginPage from "@/pages/LoginPage";
import HomePage from "@/pages/HomePage";
import ProtectedRoute from "@/components/core/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DefaultLayout />,
  },
  {
    path: "/login",
    element: <BlankLayout />,
    children: [{ index: true, element: <LoginPage /> }],
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <DefaultLayout />
      </ProtectedRoute>
    ),
    children: [{ index: true, element: <HomePage /> }],
  },
]);

export default router;
