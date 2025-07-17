import { Router, Request, Response } from "express";
import { createLead, updateUserLead } from "../controllers/leads.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { check } from "express-validator";
import { Lead } from "@prisma/client";

const router = Router();
const leadProps = [
  "data.firstName",
  "data.lastName",
  "data.email",
  "data.phone",
  "data.company",
  "data.jobTitle",
  "data.industry",
  "data.status",
  "data.website",
  "data.address",
  "data.city",
  "data.state",
  "data.zipCode",
  "data.country",
];

// @path: /api/leads/create
// @desc: Create a new lead
// @access: Private
router.post(
  "/create",
  authenticateToken,
  check([...leadProps]).notEmpty(),
  createLead
);

// @path: /api/leads/update
// @desc: Update a lead
// @access: Private
router.post(
  "/update",
  authenticateToken,
  check("leadId").isString().notEmpty(),
  check([...leadProps]).notEmpty(),
  updateUserLead
);

export default router;
