import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@radix-ui/themes/styles.css";
import App from "@/App.tsx";
import { Theme } from "@radix-ui/themes";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme appearance="light" accentColor="indigo" scaling="95%" className="w-dvw">
      <App />
    </Theme>
  </StrictMode>
);
