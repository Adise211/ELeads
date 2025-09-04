import { consts } from "@eleads/shared";
import { SuccessResponse } from "../server.types.js";
import { NextFunction, Request, Response } from "express";
import {
  getWorkspaceLeads as getWorkspaceLeadsModel,
  getWorkspaceUsers as getWorkspaceUsersModel,
  getWorkspaceBillings as getWorkspaceBillingsModel,
  getWorkspaceClients as getWorkspaceClientsModel,
} from "../models/workspace.model.js";
import { omitFields } from "../lib/data.helper.js";

export const getWorkspaceLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = (req as any).user;
    const leads = await getWorkspaceLeadsModel(workspaceId);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Leads fetched successfully",
      data: leads,
    };
    res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = (req as any).user;
    const users = await getWorkspaceUsersModel(workspaceId);
    const safeUsers = users.map((user) => omitFields(user, ["password"]));
    const successResponse: SuccessResponse = {
      success: true,
      message: "Users fetched successfully",
      data: safeUsers,
    };
    res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceBillings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = (req as any).user;
    const billings = await getWorkspaceBillingsModel(workspaceId);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Billings fetched successfully",
      data: billings,
    };
    res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    next(error);
  }
};

export const getWorkspaceClients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = (req as any).user;
    const clients = await getWorkspaceClientsModel(workspaceId);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Clients fetched successfully",
      data: clients,
    };
    res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    next(error);
  }
};
