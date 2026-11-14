
import express from "express";

import {
  getMyProfile,
  updateProfile,
} from "../controllers/userController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes below require a valid, verified user JWT.
router.use(authMiddleware);

router.get("/me", getMyProfile);
router.put("/update", updateProfile);

export default router;
