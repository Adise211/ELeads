import axios from "axios";
import { consts } from "@eleads/shared";
import { showErrorToast } from "@/utils/toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_API_BASE_URL,
  withCredentials: true, // Allow cookies (important)
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error
    // console.error("HTTP Error:", error);

    // Handle specific error status codes globally
    if (error.response) {
      switch (error.response.status) {
        // case httpCodes.UNAUTHORIZED:
        // showErrorToast("Unauthorized");
        // redirect to login
        // break;
        case consts.httpCodes.INTERNAL_SERVER_ERROR:
          if (location.pathname !== "/login") {
            showErrorToast("Internal Server Error");
          }
          break;
        default:
          if (location.pathname !== "/login") {
            const errorMessage = error.response.data.message || "Something went wrong";
            showErrorToast(errorMessage);
            console.error(error.response);
          }
          break;
      }
    }

    // Optionally show a user-friendly message here
    // Return a rejected promise to propagate the error
    return Promise.reject(error);
  }
);

export default api;
