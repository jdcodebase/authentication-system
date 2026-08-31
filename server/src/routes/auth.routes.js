import express from "express";
import rateLimit from "express-rate-limit";
import {
  completeRegistration,
  sendRegistrationOtp,
  verifyRegistrationOtp,
} from "../controllers/auth/registration.controller.js";
import { login } from "../controllers/auth/login.controller.js";
import { refreshAccessToken } from "../controllers/auth/refreshToken.controller.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";
import {
  logout,
  logoutAllDevices,
} from "../controllers/auth/logout.controller.js";

const router = express.Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many OTP requests, please try again later.",
});

router.post("/register/send-otp", otpLimiter, sendRegistrationOtp);
router.post("/register/verify-otp", verifyRegistrationOtp);
router.post("/register/complete", completeRegistration);

router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);

router.post("/logout", verifyAccessToken, logout);
router.post("/logout-all", verifyAccessToken, logoutAllDevices);

export default router;
