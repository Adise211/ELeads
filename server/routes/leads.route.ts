import { Router } from "express";
import { createLead, getWorkspaceLeads, updateUserLead } from "../controllers/leads.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { createLeadSchema } from "../lib/validation-schema";
import { validate } from "../middleware/validation.middleware";

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
