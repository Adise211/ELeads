import { Router } from "express";
import { createClient } from "../controllers/clients.controller.js";
import {
  createClientSchema,
  // updateClientSchema,
  // deleteClientSchema,
  // getClientSchema,
} from "../lib/validation-schema.js";
import { validate } from "../middleware/validation.middleware.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create", authenticateToken, validate(createClientSchema), createClient);

export default router;
