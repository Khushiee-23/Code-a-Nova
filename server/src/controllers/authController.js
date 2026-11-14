
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sendEmail } from "../config/mailer.js";

import {
  generateOtp,
  getOtpExpiry,
  OTP_RESEND_COOLDOWN,
} from "../utils/otp.js";

import { otpEmailTemplate } from "../utils/emailTemplates.js";

const MAX_OTP_ATTEMPTS = 5;
const OTP_LOCK_DURATION = 15 * 60 * 1000;

const createOtpChallenge = (userId) => {
  return jwt.sign(
    {
      userId,
      purpose: "otp",
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

// POST /api/auth/signup
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required.",
    });
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!/^[A-Za-z ]{3,80}$/.test(normalizedName)) {
    return res.status(400).json({
      success: false,
      message: "Name must contain at least 3 letters.",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid email address.",
    });
  }

  if (password.length < 8) {
    return res.status(400).json({
      success: false,
      message: "Password must contain at least 8 characters.",
    });
  }

  const existingUser = await User.findOne({
    email: normalizedEmail,
  });

  if (existingUser?.isVerified) {
    return res.status(409).json({
      success: false,
      message: "An account with this email already exists.",
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const otp = generateOtp();
  const otpHash = await bcrypt.hash(otp, 10);

  let user;
  let previousData = null;

  if (existingUser) {
    previousData = {
      name: existingUser.name,
      passwordHash: existingUser.passwordHash,
      otpHash: existingUser.otpHash,
      otpExpiresAt: existingUser.otpExpiresAt,
      otpLastSentAt: existingUser.otpLastSentAt,
      otpAttempts: existingUser.otpAttempts,
      otpLockedUntil: existingUser.otpLockedUntil,
    };

    existingUser.name = normalizedName;
    existingUser.passwordHash = passwordHash;
    existingUser.otpHash = otpHash;
    existingUser.otpExpiresAt = getOtpExpiry();
    existingUser.otpLastSentAt = new Date();
    existingUser.otpAttempts = 0;
    existingUser.otpLockedUntil = null;

    user = await existingUser.save();
  } else {
    user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
      otpHash,
      otpExpiresAt: getOtpExpiry(),
      otpLastSentAt: new Date(),
      otpAttempts: 0,
      otpLockedUntil: null,
    });
  }

  try {
    await sendEmail({
      to: user.email,
      subject: "Code-a-Nova | Email Verification",
      html: otpEmailTemplate(otp),
    });
  } catch (error) {
    console.error("OTP email failed:", error.message);

    if (existingUser) {
      Object.assign(existingUser, previousData);
      await existingUser.save();
    } else {
      await User.findByIdAndDelete(user._id);
    }

    return res.status(503).json({
      success: false,
      message: "Unable to send OTP. Please try again.",
    });
  }

  const otpChallengeToken = createOtpChallenge(user._id);

  res.status(201).json({
    success: true,
    message: "Signup successful. OTP sent to your email.",
    data: {
      email: user.email,
      otpChallengeToken,
    },
  });
});

// POST /api/auth/verifyotp
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (
    typeof email !== "string" ||
    !/^\d{6}$/.test(String(otp || ""))
  ) {
    return res.status(400).json({
      success: false,
      message: "A valid email and six-digit OTP are required.",
    });
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user || user.isVerified || !user.otpHash) {
    return res.status(400).json({
      success: false,
      message: "Invalid or already-used OTP.",
    });
  }

  if (
    user.otpLockedUntil &&
    user.otpLockedUntil > new Date()
  ) {
    const remainingMinutes = Math.ceil(
      (user.otpLockedUntil.getTime() - Date.now()) / 60000
    );

    return res.status(429).json({
      success: false,
      message: `Too many incorrect attempts. Try again in ${remainingMinutes} minute(s).`,
    });
  }

  // Reset an expired lockout.
  if (user.otpLockedUntil && user.otpLockedUntil <= new Date()) {
    user.otpAttempts = 0;
    user.otpLockedUntil = null;
  }

  if (!user.otpExpiresAt || user.otpExpiresAt <= new Date()) {
    return res.status(400).json({
      success: false,
      message: "OTP expired. Request a new OTP.",
    });
  }

  const isValidOtp = await bcrypt.compare(
    String(otp),
    user.otpHash
  );

  if (!isValidOtp) {
    user.otpAttempts = (user.otpAttempts || 0) + 1;

    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      user.otpLockedUntil = new Date(
        Date.now() + OTP_LOCK_DURATION
      );
    }

    await user.save();

    if (user.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        message: "Too many incorrect attempts. OTP verification is locked for 15 minutes.",
      });
    }

    return res.status(400).json({
      success: false,
      message: `Incorrect OTP. ${MAX_OTP_ATTEMPTS - user.otpAttempts} attempt(s) remaining.`,
    });
  }

  // Clear OTP data after successful verification.
  user.isVerified = true;
  user.otpHash = null;
  user.otpExpiresAt = null;
  user.otpLastSentAt = null;
  user.otpAttempts = 0;
  user.otpLockedUntil = null;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully. Please log in.",
  });
});

// POST /api/auth/resendotp
export const resendOtp = asyncHandler(async (req, res) => {
  const user = await User.findById(req.otpUserId);

  if (!user || user.isVerified) {
    return res.status(404).json({
      success: false,
      message: "Pending verification account not found.",
    });
  }

  const elapsed =
    Date.now() - new Date(user.otpLastSentAt || 0).getTime();

  if (elapsed < OTP_RESEND_COOLDOWN) {
    const remainingSeconds = Math.ceil(
      (OTP_RESEND_COOLDOWN - elapsed) / 1000
    );

    return res.status(429).json({
      success: false,
      message: `Please wait ${remainingSeconds} seconds before requesting another OTP.`,
    });
  }

  const previousOtpData = {
    otpHash: user.otpHash,
    otpExpiresAt: user.otpExpiresAt,
    otpLastSentAt: user.otpLastSentAt,
    otpAttempts: user.otpAttempts,
    otpLockedUntil: user.otpLockedUntil,
  };

  const otp = generateOtp();

  user.otpHash = await bcrypt.hash(otp, 10);
  user.otpExpiresAt = getOtpExpiry();
  user.otpLastSentAt = new Date();
  user.otpAttempts = 0;
  user.otpLockedUntil = null;

  await user.save();

  try {
    await sendEmail({
      to: user.email,
      subject: "Code-a-Nova | New Verification OTP",
      html: otpEmailTemplate(otp),
    });
  } catch (error) {
    console.error("Resend OTP email failed:", error.message);

    Object.assign(user, previousOtpData);
    await user.save();

    return res.status(503).json({
      success: false,
      message: "Unable to send a new OTP. Please try again.",
    });
  }

  res.status(200).json({
    success: true,
    message: "A new OTP has been sent.",
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password
  ) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required.",
    });
  }

  const user = await User.findOne({
    email: email.trim().toLowerCase(),
  });

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  if (!user.isVerified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email before logging in.",
    });
  }

  const passwordMatches = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!passwordMatches) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password.",
    });
  }

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    success: true,
    message: "Login successful.",
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    },
  });
});
