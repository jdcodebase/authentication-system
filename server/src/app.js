import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import env from "./config/env.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

export default app;
