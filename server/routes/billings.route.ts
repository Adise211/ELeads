import { Router } from "express";
import { authenticateStytchSession, checkPermission } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  createBillingSchema,
  // deleteBillingSchema,
  updateBillingSchema,
} from "../lib/validation-schema.js";
import { createBilling, deleteBilling, updateBilling } from "../controllers/billings.controller.js";
import { types } from "@eleads/shared";

const router = Router();

// @path: /api/billings/create
// @desc: Create a new billing
// @access: Private
router.post(
  "/create",
  authenticateStytchSession,
  checkPermission([types.Permission.CREATE_BILLING, types.Permission.MANAGE_BILLING]),
  validate(createBillingSchema),
  createBilling
);

// @path: /api/billings/update
// @desc: Update a billing
// @access: Private
router.put(
  "/update",
  authenticateStytchSession,
  checkPermission([types.Permission.EDIT_BILLING, types.Permission.MANAGE_BILLING]),
  validate(updateBillingSchema),
  updateBilling
);

// @path: /api/billings/delete/:id
// @desc: Delete a billing
// @access: Private
router.delete(
  "/delete/:id",
  authenticateStytchSession,
  checkPermission([types.Permission.DELETE_BILLING, types.Permission.MANAGE_BILLING]),
  deleteBilling
);

export default router;
