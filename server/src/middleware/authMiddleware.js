
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// Protect application routes using the user's JWT.
export const authMiddleware = asyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is missing.",
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: "Authentication configuration error.",
    });
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });
  } catch {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }

  // Normal application routes must not accept OTP challenge tokens.
  if (
    !decoded ||
    typeof decoded !== "object" ||
    decoded.purpose ||
    typeof decoded.userId !== "string" ||
    !mongoose.Types.ObjectId.isValid(decoded.userId)
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid authentication token.",
    });
  }

  const user = await User.findById(decoded.userId).select(
    "-passwordHash -otpHash"
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User no longer exists.",
    });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email first.",
    });
  }

  req.user = user;
  next();
});

// Resend OTP requires a separate, limited-purpose challenge token.
export const otpChallengeMiddleware = (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "OTP challenge token required.",
      });
    }

    const token = authorization.slice(7).trim();

    if (!token || !process.env.JWT_SECRET) {
      return res.status(401).json({
        success: false,
        message: "OTP challenge token is missing or invalid.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    if (
      !decoded ||
      typeof decoded !== "object" ||
      decoded.purpose !== "otp" ||
      typeof decoded.userId !== "string" ||
      !mongoose.Types.ObjectId.isValid(decoded.userId)
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid OTP challenge.",
      });
    }

    req.otpUserId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "OTP challenge expired or invalid.",
    });
  }
};
