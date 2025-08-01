import { Router, Request, Response } from "express";
import { createLead, updateUserLead } from "../controllers/leads.controller";
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

export default router;
