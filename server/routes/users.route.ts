import { Router, Request, Response } from "express";
import {
  getAuthenticatedUser,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/users.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { loginUserSchema, registerUserSchema } from "../lib/validation-schema";

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
router.post("/register", validate(registerUserSchema), registerUser);

// @path: /api/users/login
// @desc: Users login route
// @access: Public
router.post("/login", validate(loginUserSchema), loginUser);

// @path: /api/users/me
// @desc: Get current authenticated user
// @access: Private
router.get("/me", authenticateToken, getAuthenticatedUser);

// @path: /api/users/logout
// @desc: Logout user
// @access: Public
router.get("/logout", logoutUser);

export default router;
