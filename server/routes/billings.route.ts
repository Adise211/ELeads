import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { createBillingSchema } from "../lib/validation-schema.js";
import { createBilling } from "../controllers/billings.controller.js";

const router = Router();

router.post("/create", authenticateToken, validate(createBillingSchema), createBilling);

export default router;
