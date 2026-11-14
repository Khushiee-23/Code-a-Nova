
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    otpHash: {
      type: String,
      default: null,
    },

    otpExpiresAt: {
      type: Date,
      default: null,
    },

    otpLastSentAt: {
      type: Date,
      default: null,
    },

    otpAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    otpLockedUntil: {
      type: Date,
      default: null,
    },
    otpAttempts: {
  type: Number,
  default: 0,
  min: 0,
},

otpLockedUntil: {
  type: Date,
  default: null,
},
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
