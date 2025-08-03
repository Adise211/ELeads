import { Request, Response, NextFunction } from "express";
import {
  createLead as createLeadModel,
  updateUserLead as updateUserLeadModel,
  getLeads as getLeadsModel,
} from "../models/leads.model";
import { httpCodes } from "../utils/errorCodes";
import { SuccessResponse } from "../server.types";

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

export const getWorkspaceLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = (req as any).user;
    const leads = await getLeadsModel(workspaceId);
    res.status(httpCodes.SUCCESS).json(leads);
  } catch (error) {
    next(error);
  }
};
