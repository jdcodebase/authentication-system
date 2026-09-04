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
import { changePassword } from "../controllers/auth/changePassword.controller.js";
import {
  resetPassword,
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
} from "../controllers/auth/passwordReset.controller.js";
import {
  sendOldEmailChangeOtp,
  verifyOldEmailChangeOtp,
  sendNewEmailChangeOtp,
  verifyNewEmailChangeOtp,
} from "../controllers/auth/emailChange.controller.js";

const router = express.Router();

const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many OTP requests. Please try again later.",
    errors: [],
  },
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many verification attempts. Please try again later.",
    errors: [],
  },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    statusCode: 429,
    message: "Too many login attempts. Please try again later.",
    errors: [],
  },
});

router.post("/register/send-otp", otpLimiter, sendRegistrationOtp);
router.post("/register/verify-otp", otpVerifyLimiter, verifyRegistrationOtp);
router.post("/register/complete", completeRegistration);

router.post("/login", loginLimiter, login);
router.post("/refresh-token", refreshAccessToken);

router.post("/logout", logout);
router.post("/logout-all", verifyAccessToken, logoutAllDevices);

router.patch("/change-password", verifyAccessToken, changePassword);

router.post("/forgot-password/send-otp", otpLimiter, sendForgotPasswordOtp);

router.post("/forgot-password/verify-otp", otpLimiter, verifyForgotPasswordOtp);

router.post("/forgot-password/reset", resetPassword);

router.post(
  "/change-email/send-old-otp",
  verifyAccessToken,
  otpLimiter,
  sendOldEmailChangeOtp,
);

router.post(
  "/change-email/verify-old-otp",
  verifyAccessToken,
  otpVerifyLimiter,
  verifyOldEmailChangeOtp,
);

router.post("/change-email/send-new-otp", otpLimiter, sendNewEmailChangeOtp);

router.post(
  "/change-email/verify-new-otp",
  otpVerifyLimiter,
  verifyNewEmailChangeOtp,
);

export default router;
