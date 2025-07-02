import { Router, Request, Response } from "express";

const router = Router();

// @path: /api/leads
// @desc: Leads route
// @access: Private
router.get("/", (req: Request, res: Response) => {
  res.send("Leads route");
});

export default router;
