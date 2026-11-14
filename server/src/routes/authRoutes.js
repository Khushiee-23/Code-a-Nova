import express from "express";

import {
  signup,
  verifyOtp,
  resendOtp,
  login,
} from "../controllers/authController.js";

import {
  otpChallengeMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verifyotp", verifyOtp);
router.post("/login", login);

// Requires the limited-purpose OTP challenge token.
router.post(
  "/resendotp",
  otpChallengeMiddleware,
  resendOtp
);

export default router;