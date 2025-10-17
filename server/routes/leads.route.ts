import { Router } from "express";
import {
  createLead,
  deleteLead,
  updateUserLead,
  createNote,
  updateNote,
  deleteNote,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../controllers/leads.controller.js";
import { authenticateStytchSession, checkPermission } from "../middleware/auth.middleware.js";
import {
  createLeadSchema,
  updateLeadSchema,
  createNoteSchema,
  updateNoteSchema,
  createActivitySchema,
  updateActivitySchema,
  deleteActivitySchema,
  deleteNoteSchema,
} from "../lib/validation-schema.js";
import { validate } from "../middleware/validation.middleware.js";
import { Permission } from "@eleads/shared/dist/types/index.js";

const router = Router();

// @path: /api/leads/create
// @desc: Create a new lead
// @access: Private
router.post("/create", authenticateStytchSession, validate(createLeadSchema), createLead);

// @path: /api/leads/update
// @desc: Update a lead
// @access: Private
router.put(
  "/update",
  authenticateStytchSession,
  checkPermission(Permission.EDIT_WORKSPACE_LEADS),
  validate(updateLeadSchema),
  updateUserLead
);

// @path: /api/leads/delete
// @desc: Delete a lead
// @access: Private
router.delete(
  "/delete/:id",
  authenticateStytchSession,
  checkPermission(Permission.DELETE_WORKSPACE_LEADS),
  deleteLead
);

// Note routes
// @path: /api/leads/notes/create
// @desc: Create a new note for a lead
// @access: Private
router.post("/notes/create", authenticateStytchSession, validate(createNoteSchema), createNote);

// @path: /api/leads/notes/update
// @desc: Update a note
// @access: Private
router.put("/notes/update", authenticateStytchSession, validate(updateNoteSchema), updateNote);

// @path: /api/leads/notes/delete/:noteId
// @desc: Delete a note
// @access: Private
router.delete(
  "/notes/delete/:noteId",
  authenticateStytchSession,
  validate(deleteNoteSchema),
  deleteNote
);

// @path: /api/leads/activities/create
// @desc: Create a new activity for a lead
// @access: Private
router.post(
  "/activities/create",
  authenticateStytchSession,
  validate(createActivitySchema),
  createActivity
);

// @path: /api/leads/activities/update
// @desc: Update an activity
// @access: Private
router.put(
  "/activities/update",
  authenticateStytchSession,
  validate(updateActivitySchema),
  updateActivity
);

// @path: /api/leads/activities/delete/:activityId
// @desc: Delete an activity
// @access: Private
router.delete(
  "/activities/delete/:activityId",
  authenticateStytchSession,
  validate(deleteActivitySchema),
  deleteActivity
);

export default router;
