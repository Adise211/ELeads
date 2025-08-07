import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { getWorkspaceLeads } from "../controllers/workspace.controller.js";

const router = Router();

// @path: /api/workspace/all-leads
// @desc: Get all leads in a workspace
// @access: Private
router.get("/all-leads", authenticateToken, getWorkspaceLeads);

export default router;
