import { Router } from "express";
import {
  createLead,
  deleteLead,
  updateUserLead,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/leads.controller.js";
import { authenticateToken, checkPermission } from "../middleware/auth.middleware.js";
import {
  createLeadSchema,
  updateLeadSchema,
  createNoteSchema,
  updateNoteSchema,
} from "../lib/validation-schema.js";
import { validate } from "../middleware/validation.middleware.js";
import { Permission } from "@eleads/shared/dist/types/index.js";

const router = Router();

// @path: /api/leads/create
// @desc: Create a new lead
// @access: Private
router.post("/create", authenticateToken, validate(createLeadSchema), createLead);

// @path: /api/leads/update
// @desc: Update a lead
// @access: Private
router.put(
  "/update",
  authenticateToken,
  checkPermission(Permission.EDIT_WORKSPACE_LEADS),
  validate(updateLeadSchema),
  updateUserLead
);

// @path: /api/leads/delete
// @desc: Delete a lead
// @access: Private
router.delete(
  "/delete/:id",
  authenticateToken,
  checkPermission(Permission.DELETE_WORKSPACE_LEADS),
  deleteLead
);

// Note routes
// @path: /api/leads/notes/create
// @desc: Create a new note for a lead
// @access: Private
router.post("/notes/create", authenticateToken, validate(createNoteSchema), createNote);

// @path: /api/leads/notes/update
// @desc: Update a note
// @access: Private
router.put("/notes/update", authenticateToken, validate(updateNoteSchema), updateNote);

// @path: /api/leads/notes/delete/:noteId
// @desc: Delete a note
// @access: Private
router.delete("/notes/delete/:noteId", authenticateToken, deleteNote);

export default router;
