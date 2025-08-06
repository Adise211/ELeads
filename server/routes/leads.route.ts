import { Router } from "express";
import { createLead, getWorkspaceLeads, updateUserLead } from "../controllers/leads.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { createLeadSchema } from "../lib/validation-schema.js";
import { validate } from "../middleware/validation.middleware.js";

const router = Router();

// @path: /api/leads/create
// @desc: Create a new lead
// @access: Private
router.post("/create", authenticateToken, validate(createLeadSchema), createLead);

// @path: /api/leads/update
// @desc: Update a lead
// @access: Private
router.post("/update", authenticateToken, updateUserLead);

// @path: /api/leads/get
// @desc: Get all workspace leads
// @access: Private
router.get("/get", authenticateToken, getWorkspaceLeads);

export default router;
