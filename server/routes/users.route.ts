import { Router, Request, Response } from "express";
import { registerUser } from "../controllers/users.controller";

const router = Router();

// @path: /api/users
// @desc: Users route
// @access: Public
router.get("/", (req: Request, res: Response) => {
  res.send("Users route");
});

// @path: /api/users/register
// @desc: Users registration route
// @access: Public
router.post("/register", registerUser);

// @path: /api/users/login
// @desc: Users login route
// @access: Public
router.post("/login", (req: Request, res: Response) => {
  res.send("Users login route");
});

export default router;
