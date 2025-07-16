import { Request, Response, NextFunction } from "express";
import { CustomError, ErrorResponse } from "../server.types";

// Create custom error class
export class AppError extends Error implements CustomError {
  statusCode: number;
  status: string;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Handle Prisma errors
const handlePrismaError = (error: any): AppError => {
  if (error.code === "P2002") {
    return new AppError("Duplicate field value entered", 400);
  }
  if (error.code === "P2014") {
    return new AppError("Invalid ID: no record found", 400);
  }
  if (error.code === "P2003") {
    return new AppError("Invalid input data", 400);
  }
  if (error.code === "P2025") {
    return new AppError("Record not found", 404);
  }

  return new AppError("Database operation failed", 500);
};

// Handle validation errors
const handleValidationError = (error: any): AppError => {
  const errors = Object.values(error.errors).map((val: any) => val.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

// Handle JWT errors
const handleJWTError = (): AppError =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = (): AppError =>
  new AppError("Your token has expired! Please log in again.", 401);

// Send error response for development
const sendErrorDev = (err: CustomError, res: Response): void => {
  const errorResponse: ErrorResponse = {
    status: err.status || "error",
    message: err.message,
    error: err,
    stack: err.stack,
  };

  res.status(err.statusCode || 500).json(errorResponse);
};

// Send error response for production
const sendErrorProd = (err: CustomError, res: Response): void => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    const errorResponse: ErrorResponse = {
      status: err.status || "error",
      message: err.message,
    };

    res.status(err.statusCode || 500).json(errorResponse);
  } else {
    // Programming or other unknown error: don't leak error details
    console.error("ERROR 💥:", err);

    const errorResponse: ErrorResponse = {
      status: "error",
      message: "Something went wrong!",
    };

    res.status(500).json(errorResponse);
  }
};

// Main error handling middleware
export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (error.code && error.code.startsWith("P")) {
      error = handlePrismaError(error);
    }
    if (error.name === "ValidationError") {
      error = handleValidationError(error);
    }
    if (error.name === "JsonWebTokenError") {
      error = handleJWTError();
    }
    if (error.name === "TokenExpiredError") {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, res);
  }
};

// Async error catcher wrapper
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

// Handle unhandled routes
export const handleNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const err = new AppError(
    `Can't find ${req.originalUrl} on this server!`,
    404
  );
  next(err);
};

// Handle uncaught exceptions
export const handleUncaughtException = (): void => {
  process.on("uncaughtException", (err: Error) => {
    console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    process.exit(1);
  });
};

// Handle unhandled promise rejections
export const handleUnhandledRejection = (server: any): void => {
  process.on("unhandledRejection", (err: Error) => {
    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
    console.log(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};
