import path from "path";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env vars for the current mode at build time
  const env = loadEnv(mode, process.cwd(), "");
  const backendOrigin = env.VITE_BACKEND_ORIGIN || process.env.VITE_BACKEND_ORIGIN || "";

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        // Redirect all requests to the backend server
        // example: localhost:5173/api/login -> localhost:8080/api/login
        "/api": {
          target: backendOrigin || undefined,
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
    optimizeDeps: {
      include: ["@eleads/shared"],
    },
  };
});
