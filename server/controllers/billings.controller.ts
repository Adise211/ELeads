import { Request, Response, NextFunction } from "express";
import { createBilling as createBillingModel } from "../models/billings.model.js";
import { SuccessResponse } from "../server.types.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { consts } from "@eleads/shared";

export const createBilling = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = (req as any).user;
    const data = req.body;
    const billing = await createBillingModel(data, workspaceId);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Billing created successfully",
      data: billing,
    };
    res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error: any) {
    console.log("error in createBilling", error);
    next(new AppError(error.message, consts.httpCodes.INTERNAL_SERVER_ERROR));
  }
};
