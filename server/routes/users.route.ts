import { Router, Request, Response } from "express";
import {
  getAuthenticatedUser,
  loginUser,
  logoutUser,
  registerUser,
  changeUserPassword,
  updateUserInfo,
  sendOTPToUser,
  testCachedOTP,
  verifyOTPCode,
  generateCustomOTPCode,
} from "../controllers/users.controller.js";
import { authenticateStytchSession } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import {
  loginUserSchema,
  registerUserSchema,
  sendOTPToUserSchema,
  verifyOTPCodeSchema,
} from "../lib/validation-schema.js";

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
router.get("/me", authenticateStytchSession, getAuthenticatedUser);

// @path: /api/users/logout
// @desc: Logout user
// @access: Public
router.get("/logout", logoutUser);

// @path: /api/users/change-password
// @desc: Change user password
// @access: Private
router.post("/change-password", authenticateStytchSession, changeUserPassword);

// @path: /api/users/update-info
// @desc: Update user info
// @access: Private
router.put("/update-info", authenticateStytchSession, updateUserInfo);

// @path: /api/users/send-otp
// @desc: Send OTP to user
// @access: Public
router.post("/send-otp", validate(sendOTPToUserSchema), sendOTPToUser);

// @path: /api/users/verify-otp
// @desc: Verify OTP code
// @access: Public
router.post("/verify-otp", verifyOTPCode);

// @path: /api/users/generate-custom-otp
// @desc: Generate custom OTP code
// @access: Public
router.post("/generate-custom-otp", validate(sendOTPToUserSchema), generateCustomOTPCode);

export default router;
