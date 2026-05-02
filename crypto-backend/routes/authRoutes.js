import express from "express";
import {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
  verifyEmail,
  resendOtp,
} from "../controllers/authController.js";

const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Verify email route
router.post("/verify-email", verifyEmail);

// Resend OTP route
router.post("/resend-otp", resendOtp);

// Refresh token
router.post("/refresh", refreshToken);

// Logout
router.post("/logout", logoutUser);

export default router;
