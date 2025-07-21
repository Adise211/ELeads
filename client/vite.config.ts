import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const port = Number(process.env.VITE_PORT) || 8080;
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
