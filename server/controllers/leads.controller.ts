import { Request, Response, NextFunction } from "express";
import {
  createLead as createLeadModel,
  updateUserLead as updateUserLeadModel,
} from "../models/leads.model.js";
import { httpCodes } from "@eleads/shared";
import { SuccessResponse } from "../server.types.js";

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as any).user;
    const data = req.body;
    const createdLead = await createLeadModel(userId, data);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Lead created successfully",
      data: createdLead,
    };
    res.status(httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    next(error);
  }
};

export const updateUserLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = (req as any).user;
    const { leadId, data } = req.body;
    const updatedLead = await updateUserLeadModel(userId, leadId, data);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    };
    res.status(httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    next(error);
  }
};
