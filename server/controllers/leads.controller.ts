import { Request, Response, NextFunction } from "express";
import { consts } from "@eleads/shared";
import {
  createLead as createLeadModel,
  updateUserLead as updateUserLeadModel,
} from "../models/leads.model.js";

import { SuccessResponse } from "../server.types.js";
import { Lead } from "@prisma/client";

export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, workspaceId } = (req as any).user;
    const data = req.body;
    const createdLead = await createLeadModel(userId, workspaceId, data);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Lead created successfully",
      data: createdLead,
    };
    res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    next(error);
  }
};

export const updateUserLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, workspaceId } = (req as any).user;
    const data: Lead = req.body;
    const updatedLead = await updateUserLeadModel(userId, workspaceId, data);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    };
    res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    console.log("error in updateUserLead", error);
    next(error);
  }
};
