import { Request, Response, NextFunction } from "express";
import { consts } from "@eleads/shared";
import {
  createLead as createLeadModel,
  deleteUserLead as deleteUserLeadModel,
  updateUserLead as updateUserLeadModel,
  createNote as createNoteModel,
  updateNote as updateNoteModel,
  deleteNote as deleteNoteModel,
  getLeadWithNotes as getLeadWithNotesModel,
  getNoteById as getNoteByIdModel,
} from "../models/leads.model.js";

import { SuccessResponse } from "../server.types.js";
import { Lead } from "@prisma/client";
import { AppError } from "../middleware/errorHandler.middleware.js";
import sanitizeHtml from "sanitize-html";

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
    const { workspaceId } = (req as any).user;
    const data: Lead = req.body;
    const updatedLead = await updateUserLeadModel(data.assignedToId, workspaceId, data);
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

export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = (req as any).user;
    const { id } = req.params;

    await deleteUserLeadModel(workspaceId, id);
    const successResponse: SuccessResponse = {
      success: true,
      message: "Lead deleted successfully",
      data: {},
    };
    res.status(consts.httpCodes.SUCCESS).json(successResponse);
  } catch (error) {
    console.log("error in deleteLead", error);
    next(error);
  }
};

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = (req as any).user;
    const { leadId, content } = req.body;

    // Verify the lead exists and belongs to the workspace
    const lead = await getLeadWithNotesModel(leadId, workspaceId);
    if (!lead) {
      throw new AppError("Lead not found", consts.httpCodes.NOT_FOUND);
    } else {
      const sanitizedContent = sanitizeHtml(content);
      const createdNote = await createNoteModel(leadId, sanitizedContent);
      const successResponse: SuccessResponse = {
        success: true,
        message: "Note created successfully",
        data: createdNote,
      };
      res.status(consts.httpCodes.SUCCESS).json(successResponse);
    }
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = (req as any).user;
    const { noteId, content } = req.body;

    // Verify the note exists and belongs to a lead in the workspace
    const note = await getNoteByIdModel(noteId, workspaceId);

    if (!note || !note.lead) {
      throw new AppError("Note not found", consts.httpCodes.NOT_FOUND);
    } else {
      const sanitizedContent = sanitizeHtml(content);
      const updatedNote = await updateNoteModel(noteId, sanitizedContent);
      const successResponse: SuccessResponse = {
        success: true,
        message: "Note updated successfully",
        data: updatedNote,
      };

      res.status(consts.httpCodes.SUCCESS).json(successResponse);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { workspaceId } = (req as any).user;
    const { noteId } = req.params;

    // Verify the note exists and belongs to a lead in the workspace
    const note = await getNoteByIdModel(noteId, workspaceId);

    if (!note || !note.lead) {
      throw new AppError("Note not found", consts.httpCodes.NOT_FOUND);
    } else {
      await deleteNoteModel(noteId);
      const successResponse: SuccessResponse = {
        success: true,
        message: "Note deleted successfully",
        data: {},
      };
      res.status(consts.httpCodes.SUCCESS).json(successResponse);
    }
  } catch (error) {
    next(error);
  }
};
