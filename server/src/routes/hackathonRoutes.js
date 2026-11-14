
import express from "express";

import {
  createRegistration,
  getMyEntry,
  deleteRegistration,
} from "../controllers/hackathonController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All hackathon routes require a valid, verified user JWT.
router.use(authMiddleware);

router.post("/register", createRegistration);
router.get("/myentry", getMyEntry);
router.delete("/:id", deleteRegistration);

export default router;
