import { Request, Response, NextFunction } from "express";
import { CustomError, ErrorResponse } from "../server.types";
import { httpCodes } from "../utils/errorCodes";

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
    return new AppError("Duplicate field value entered", httpCodes.BAD_REQUEST);
  }
  if (error.code === "P2014") {
    return new AppError("Invalid ID: no record found", httpCodes.BAD_REQUEST);
  }
  if (error.code === "P2003") {
    return new AppError("Invalid input data", httpCodes.BAD_REQUEST);
  }
  if (error.code === "P2025") {
    return new AppError("Record not found", httpCodes.NOT_FOUND);
  }

  return new AppError(
    "Database operation failed",
    httpCodes.INTERNAL_SERVER_ERROR
  );
};

// Handle validation errors
const handleValidationError = (error: any): AppError => {
  const errors = error.errors.map((val: any) => `'${val.path}'`);
  const message = `Invalid value for: ${errors.join(", ")}`;
  return new AppError(message, httpCodes.BAD_REQUEST);
};

// Handle JWT errors
const handleJWTError = (): AppError =>
  new AppError("Invalid token. Please log in again!", httpCodes.UNAUTHORIZED);

const handleJWTExpiredError = (): AppError =>
  new AppError(
    "Your token has expired! Please log in again.",
    httpCodes.UNAUTHORIZED
  );

// Send error response for development
const sendErrorDev = (err: CustomError, res: Response): void => {
  const errorResponse: ErrorResponse = {
    success: false,
    status: err.status || "error",
    message: err.message,
    error: err,
    stack: err.stack,
  };

  res
    .status(err.statusCode || httpCodes.INTERNAL_SERVER_ERROR)
    .json(errorResponse);
};

// Send error response for production
const sendErrorProd = (err: CustomError, res: Response): void => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    const errorResponse: ErrorResponse = {
      success: false,
      status: err.status || "error",
      message: err.message,
    };

    res.status(err.statusCode || 500).json(errorResponse);
  } else {
    // Programming or other unknown error: don't leak error details
    console.error("ERROR 💥:", err);

    const errorResponse: ErrorResponse = {
      success: false,
      status: "error",
      message: "Something went wrong!",
    };

    res.status(httpCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
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
    httpCodes.NOT_FOUND
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
