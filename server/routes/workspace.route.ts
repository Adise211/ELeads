import { Router } from "express";
import { authenticateStytchSession } from "../middleware/auth.middleware.js";
import {
  getWorkspaceBillings,
  getWorkspaceClients,
  getWorkspaceLeads,
  getWorkspaceUsers,
} from "../controllers/workspace.controller.js";

const router = Router();

// @path: /api/workspace/all-leads
// @desc: Get all leads in a workspace
// @access: Private
router.get("/all-leads", authenticateStytchSession, getWorkspaceLeads);

// @path: /api/workspace/all-users
// @desc: Get all users in a workspace
// @access: Private
router.get("/all-users", authenticateStytchSession, getWorkspaceUsers);

// @path: /api/workspace/all-billings
// @desc: Get all billings in a workspace
// @access: Private
router.get("/all-billings", authenticateStytchSession, getWorkspaceBillings);

// @path: /api/workspace/all-clients
// @desc: Get all clients in a workspace
// @access: Private
router.get("/all-clients", authenticateStytchSession, getWorkspaceClients);

export default router;
