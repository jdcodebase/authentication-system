import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import env from "./config/env.js";
import errorHandler from "./middleware/errorHandler.middleware.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());
app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// API routes will be registered here.
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Route not found",
    errors: [],
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
