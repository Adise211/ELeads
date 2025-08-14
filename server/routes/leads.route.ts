import { Router } from "express";
import { createLead, deleteLead, updateUserLead } from "../controllers/leads.controller.js";
import { authenticateToken, checkPermission } from "../middleware/auth.middleware.js";
import { createLeadSchema, updateLeadSchema } from "../lib/validation-schema.js";
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

export default router;
