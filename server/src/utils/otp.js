import crypto from "crypto";

// Generate a cryptographically random six-digit OTP.
export const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// OTP validity: 10 minutes.
export const getOtpExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000);
};

// Resend cooldown: 60 seconds.
export const OTP_RESEND_COOLDOWN = 60 * 1000;