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
    next(error);
  }
};
