import { Router, Request, Response } from "express";
import { loginUser, registerUser } from "../controllers/users.controller";
import { body } from "express-validator";

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
router.post(
  "/register",
  body([
    "user.firstName",
    "user.lastName",
    "user.email",
    "user.password",
    "user.role",
    "user.phone",
    "workspace.name",
  ]).notEmpty(),
  registerUser
);

// @path: /api/users/login
// @desc: Users login route
// @access: Public
router.post(
  "/login",
  body("email", "Invalid email").isEmail(),
  body("password", "Invalid password").isLength({ min: 8 }),
  loginUser
);

export default router;
