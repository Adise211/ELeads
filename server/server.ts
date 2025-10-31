import dotenv from "dotenv";

// Load environment variables based on NODE_ENV
function loadEnvironmentVariables() {
  try {
    const nodeEnv = process.env.NODE_ENV || "development"; // Default to 'development' if not set
    switch (nodeEnv) {
      case "production":
        dotenv.config({ path: ".env.production" });
        break;
      case "staging":
        dotenv.config({ path: ".env.staging" });
        break;
      default:
        dotenv.config({ path: ".env" });
        break;
    }
  } catch (error) {
    console.error("Error loading environment variables", error);
    process.exit(1);
  }
}

loadEnvironmentVariables();

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rootRouter from "./routes/index.route.js";
import { globalErrorHandler, handleNotFound } from "./middleware/errorHandler.middleware.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

const app = express();
const port = process.env.PORT || 8080;
console.log("Server is starting...");
console.log(`Environment: ${process.env.NODE_ENV}`);

const corsConfig = {
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true, // Allow cookies (important)
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

app.use(helmet()); // Helmet is a middleware that helps secure the app (security headers) by setting various HTTP headers
app.use(limiter); // Apply rate limiting to all routes
app.use(express.json()); // Enable parsing of JSON request bodies from raw stream
app.use(cookieParser()); // Parse cookies from the request
app.use(cors(corsConfig)); // This is important for enabling secure communication between the frontend and backend,

app.use("/api", rootRouter);
app.get("/", (req, res) => {
  res.send("ELeads API is running");
});
// Handle unhandled routes
// app.all("*", handleNotFound);

// Global error handler
app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📡 API endpoints available at http://localhost:${port}/api`);
});
