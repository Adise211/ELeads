// Custom error interface
export interface CustomError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

// Error response interface
export interface ErrorResponse {
  success: boolean;
  status: string;
  message: string;
  error?: any;
  stack?: string;
}
