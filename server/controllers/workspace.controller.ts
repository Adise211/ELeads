import { httpCodes, SuccessResponse } from "@eleads/shared";
import { NextFunction, Request, Response } from "express";
import { getWorkspaceLeads as getWorkspaceLeadsModel } from "../models/workspace.model.js";

export const getWorkspaceLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = (req as any).user;
    const leads = await getWorkspaceLeadsModel(workspaceId);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Leads fetched successfully",
      data: leads,
    };
    res.status(httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    next(error);
  }
};
