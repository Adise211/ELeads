import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createBillingSchema,
  // deleteBillingSchema,
  updateBillingSchema,
} from "../lib/validation-schema.js";
import { createBilling, deleteBilling, updateBilling } from "../controllers/billings.controller.js";

const router = Router();

router.post("/create", authenticateToken, validate(createBillingSchema), createBilling);
router.put("/update", authenticateToken, validate(updateBillingSchema), updateBilling);
router.delete("/delete/:id", authenticateToken, deleteBilling);

export default router;
