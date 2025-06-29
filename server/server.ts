import express from "express";
import dotenv from "dotenv";
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import { appErrorHandler } from "./src/middlewares/errorHandlers.middleware.js";
import rootRouter from "./routes/index.route";

const app = express();
const port = process.env.PORT || 8080;
dotenv.config();
console.log("Server is starting...");

const corsConfig = {
  origin: process.env.FRONTEND_ORIGIN_DEV,
  credentials: true, // Allow cookies (important)
};

app.use(express.json()); // Enable parsing of JSON request bodies from raw stream
// app.use(cookieParser());
// app.use(cors(corsConfig));

app.use("/api", rootRouter);
// app.use(appErrorHandler);

app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
  console.log(`📡 API endpoints available at http://localhost:${port}/api`);
});
