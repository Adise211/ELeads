import { Request, Response, NextFunction } from "express";
import {
  createClient as createClientModel,
  updateClient as updateClientModel,
  deleteClient as deleteClientModel,
} from "../models/clients.model.js";
import { consts } from "@eleads/shared";
import { SuccessResponse } from "../server.types";

export const createClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, workspaceId } = (req as any).user;
    const data = req.body;
    const client = await createClientModel(data, workspaceId, userId);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Client created successfully",
      data: client,
    };
    return res.status(consts.httpCodes.CREATED).json(successResponse);
  } catch (error) {
    console.log("Error in createClient", error);
    next(error);
  }
};

export const updateClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, workspaceId } = (req as any).user;
    const data = req.body;
    const client = await updateClientModel(data, workspaceId, userId);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Client updated successfully",
      data: client,
    };
    return res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    console.log("Error in updateClient", error);
    next(error);
  }
};

export const deleteClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, workspaceId } = (req as any).user;
    const { id } = req.params;
    const client = await deleteClientModel(id, workspaceId, userId);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Client deleted successfully",
      data: client,
    };
    return res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    console.log("Error in deleteClient", error);
    next(error);
  }
};
