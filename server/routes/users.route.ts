import { Router, Request, Response } from "express";

const router = Router();

// @path: /api/users
// @desc: Users route
// @access: Public
router.use("/", (req: Request, res: Response) => {
  res.send("Users route");
});

export default router;
