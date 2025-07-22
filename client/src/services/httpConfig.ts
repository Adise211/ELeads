import axios from "axios";
import { httpCodes } from "../../../shared/constants";
import { showErrorToast } from "@/utils/toast";

const request = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_ORIGIN,
  withCredentials: true, // Allow cookies (important)
});

// Add a response interceptor
request.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log the error
    console.error("HTTP Error:", error);

    // Handle specific error status codes globally
    if (error.response) {
      switch (error.response.status) {
        case httpCodes.UNAUTHORIZED:
          showErrorToast("Unauthorized");
          // redirect to login
          window.location.href = "/login";
          break;
        case httpCodes.INTERNAL_SERVER_ERROR:
          showErrorToast("Internal Server Error");
          break;
        default:
          showErrorToast("Something went wrong");
          break;
      }
    }

    // Optionally show a user-friendly message here
    // Return a rejected promise to propagate the error
    return Promise.reject(error);
  }
);

export default request;
