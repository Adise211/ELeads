import { Router } from "express";
import usersRouter from "./users.route.js";
import leadsRouter from "./leads.route.js";

const router = Router();

router.use("/api/users", usersRouter);
router.use("/api/leads", leadsRouter);
router.use("/api/notes");
router.use("/api/workspaces");

export default router;
