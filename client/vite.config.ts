import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const port = Number(process.env.VITE_PORT) || 8080;
const backendOrigin = process.env.VITE_BACKEND_ORIGIN_DEV || "http://localhost:8080/api";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port,
    proxy: {
      "/api": {
        target: backendOrigin,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": "/src",
      "@shared": "../shared",
    },
  },
});
