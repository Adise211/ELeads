import { Request, Response, NextFunction } from "express";
import {
  createBilling as createBillingModel,
  updateBilling as updateBillingModel,
  deleteBilling as deleteBillingModel,
} from "../models/billings.model.js";
import { SuccessResponse } from "../server.types.js";
import { AppError } from "../middleware/errorHandler.middleware.js";
import { consts } from "@eleads/shared";

export const createBilling = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = (req as any).user;
    const data = req.body;
    // convert the billingDate and billingDueDate to ISO 8601 string format
    if (data.billingDate) {
      data.billingDate = new Date(data.billingDate).toISOString();
    }
    if (data.billingDueDate) {
      data.billingDueDate = new Date(data.billingDueDate).toISOString();
    }

    const billing = await createBillingModel(data, workspaceId);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Billing created successfully",
      data: billing,
    };
    res.status(consts.httpCodes.CREATED).json(successResponse);
  } catch (error: any) {
    console.log("error in createBilling", error);
    next(new AppError(error.message, consts.httpCodes.INTERNAL_SERVER_ERROR));
  }
};

export const updateBilling = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = (req as any).user;
    const data = req.body;
    const billing = await updateBillingModel(data, workspaceId);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Billing updated successfully",
      data: billing,
    };
    res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error: any) {
    console.log("error in updateBilling", error);
    next(new AppError(error.message, consts.httpCodes.INTERNAL_SERVER_ERROR));
  }
};

export const deleteBilling = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = (req as any).user;
    const data = req.body;
    const billing = await deleteBillingModel(data.id, workspaceId);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Billing deleted successfully",
      data: billing,
    };
    res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error: any) {
    console.log("error in deleteBilling", error);
    next(new AppError(error.message, consts.httpCodes.INTERNAL_SERVER_ERROR));
  }
};
