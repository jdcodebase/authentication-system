import express from "express";
import {
  getProfile,
  login,
  logout,
  refreshToken,
  register,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshToken);

router.get("/profile", authenticateToken, getProfile);
router.post("/logout", authenticateToken, logout);

export default router;
