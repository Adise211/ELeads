import { z } from "zod";
import { NextFunction, Request, Response } from "express";
import { httpCodes } from "../utils/errorCodes.js";
import { AppError } from "./errorHandler.middleware.js";

export const validate =
  (schema: z.ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const err = new AppError(error.issues[0].message, httpCodes.BAD_REQUEST);
        err.name = "ZodError";
        (err as any).errors = error.issues;
        throw err;
      }
    }
  };
