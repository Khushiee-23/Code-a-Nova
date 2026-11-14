import express from "express";
import cors from "cors";
import helmet from "helmet";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import hackathonRoutes from "./routes/hackathonRoutes.js";

//import { authMiddleware } from "./middleware/authMiddleware.js";

import {
  notFoundMiddleware,
  errorMiddleware,
} from "./middleware/errorMiddleware.js";

const app = express();

// Only allow requests from the configured frontend.
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(helmet());
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Code-a-Nova API is running.",
  });
});

// Public authentication endpoints.
app.use("/api/auth", authRoutes);

app.use("/api/user", userRoutes);
app.use("/api/hackathon", hackathonRoutes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;