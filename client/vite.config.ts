import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const backendOrigin = process.env.VITE_BACKEND_ORIGIN;

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Redirect all requests to the backend server
      // example: localhost:5173/api/login -> localhost:8080/api/login
      "/api": {
        target: backendOrigin,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@eleads/shared": path.resolve(__dirname, "../shared/dist/index.js"),
    },
  },
});
