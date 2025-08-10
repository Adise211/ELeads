import { Router } from "express";
import { createLead, updateUserLead } from "../controllers/leads.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { createLeadSchema, updateLeadSchema } from "../lib/validation-schema.js";
import { validate } from "../middleware/validation.middleware.js";

const router = Router();

// @path: /api/leads/create
// @desc: Create a new lead
// @access: Private
router.post("/create", authenticateToken, validate(createLeadSchema), createLead);

// @path: /api/leads/update
// @desc: Update a lead
// @access: Private
router.put("/update", authenticateToken, validate(updateLeadSchema), updateUserLead);

export default router;
