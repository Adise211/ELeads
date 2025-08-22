import dotenv from "dotenv";
// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env" });
}

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rootRouter from "./routes/index.route.js";
import { globalErrorHandler, handleNotFound } from "./middleware/errorHandler.middleware.js";
import rateLimit from "express-rate-limit";

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

app.use(limiter); // Apply rate limiting to all routes
app.use(express.json()); // Enable parsing of JSON request bodies from raw stream
app.use(cookieParser());
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
