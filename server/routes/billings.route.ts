import { Router } from "express";
import { authenticateStytchSession } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createBillingSchema,
  // deleteBillingSchema,
  updateBillingSchema,
} from "../lib/validation-schema.js";
import { createBilling, deleteBilling, updateBilling } from "../controllers/billings.controller.js";

const router = Router();

router.post("/create", authenticateStytchSession, validate(createBillingSchema), createBilling);
router.put("/update", authenticateStytchSession, validate(updateBillingSchema), updateBilling);
router.delete("/delete/:id", authenticateStytchSession, deleteBilling);

export default router;
