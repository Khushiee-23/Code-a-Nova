import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/user/me
export const getMyProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

// PUT /api/user/update
export const updateProfile = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (
    !name ||
    !/^[A-Za-z ]{3,80}$/.test(name.trim())
  ) {
    return res.status(400).json({
      success: false,
      message: "Enter a valid name containing at least 3 letters.",
    });
  }

const user = await User.findByIdAndUpdate(
  req.user._id,
  { name: name.trim() },
  {
    new: true,
    runValidators: true,
  }
).select("-passwordHash -otpHash");

if (!user) {
  return res.status(404).json({
    success: false,
    message: "User not found.",
  });
}

  res.status(200).json({
    success: true,
    message: "Profile updated successfully.",
    data: { user },
  });
});