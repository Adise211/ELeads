import { Router } from "express";
import { createClient, deleteClient, updateClient } from "../controllers/clients.controller.js";
import {
  createClientSchema,
  updateClientSchema,
  // deleteClientSchema,
  // getClientSchema,
} from "../lib/validation-schema.js";
import { validate } from "../middleware/validation.middleware.js";
import { authenticateStytchSession } from "../middleware/auth.middleware.js";

const router = Router();

// @path: /api/clients/create
// @desc: Create a new client
// @access: Private
router.post("/create", authenticateStytchSession, validate(createClientSchema), createClient);

// @path: /api/clients/update
// @desc: Update a client
// @access: Private
router.put("/update", authenticateStytchSession, validate(updateClientSchema), updateClient);

// @path: /api/clients/delete/:id
// @desc: Delete a client
// @access: Private
router.delete("/delete/:id", authenticateStytchSession, deleteClient);

export default router;
