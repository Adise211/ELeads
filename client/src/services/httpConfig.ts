import axios from "axios";
import { httpCodes } from "@shared/types";

const request = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_ORIGIN_DEV || "/api",
  withCredentials: true,
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
          // Optionally handle unauthorized globally
          // e.g., redirect to login
          break;
        case httpCodes.INTERNAL_SERVER_ERROR:
          // Optionally handle server errors
          break;
        default:
          break;
      }
    }

    // Optionally show a user-friendly message here
    // Return a rejected promise to propagate the error
    return Promise.reject(error);
  }
);

export default request;
