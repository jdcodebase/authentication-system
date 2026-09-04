import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../../models/user.model.js";
import OTP from "../../models/otp.model.js";

import { sendOtpEmail } from "../../services/email.service.js";

import env from "../../config/env.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export const sendForgotPasswordOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }

  // Check whether an account exists.
  const user = await User.findOne({
    email: normalizedEmail,
  });

  /*
   * Do not reveal whether the email is registered.
   * This prevents account/email enumeration.
   */
  if (!user) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "If an account exists with this email, an OTP has been sent.",
        ),
      );
  }

  // Check the most recent password-reset OTP.
  const existingOtp = await OTP.findOne({
    email: normalizedEmail,
    type: "PASSWORD_RESET",
  }).sort({ createdAt: -1 });

  if (existingOtp) {
    const timeSinceCreation = Date.now() - existingOtp.createdAt.getTime();

    if (timeSinceCreation < RESEND_COOLDOWN_MS) {
      const retryAfter = Math.ceil(
        (RESEND_COOLDOWN_MS - timeSinceCreation) / 1000,
      );

      throw new ApiError(429, "Please wait before requesting another OTP.", [
        { retryAfter },
      ]);
    }
  }

  // Generate a cryptographically secure 6-digit OTP.
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Never store the plain OTP.
  // HMAC prevents an exposed database from being enough to brute-force
  // the OTP without also knowing OTP_SECRET.
  const codeHash = crypto
    .createHmac("sha256", env.OTP_SECRET)
    .update(otp)
    .digest("hex");

  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

  // Replace any previous password-reset OTP.
  await OTP.deleteMany({
    email: normalizedEmail,
    type: "PASSWORD_RESET",
  });

  const otpDoc = await OTP.create({
    name: user.name,
    email: normalizedEmail,
    type: "PASSWORD_RESET",
    codeHash,
    expiresAt,
    attempts: 0,
  });

  // Send OTP email.
  // If email delivery fails, remove the OTP so the user can retry.
  try {
    await sendOtpEmail({
      name: user.name,
      email: normalizedEmail,
      otp,
    });
  } catch (error) {
    await OTP.deleteOne({ _id: otpDoc._id });

    throw new ApiError(500, "Failed to send OTP email. Please try again.");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        retryAfter: 60,
      },
      "If an account exists with this email, an OTP has been sent.",
    ),
  );
});

export const verifyForgotPasswordOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new ApiError(400, "OTP must be a 6-digit code.");
  }

  /*
   * Check that the user still exists.
   *
   * We don't expose whether the email exists to the user.
   * The send-OTP endpoint already uses a generic response for this.
   */
  const user = await User.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired OTP.");
  }

  const otpDoc = await OTP.findOne({
    email: normalizedEmail,
    type: "PASSWORD_RESET",
  });

  if (!otpDoc) {
    throw new ApiError(
      400,
      "No password reset OTP found. Please request a new OTP.",
    );
  }

  // Defensive expiration check.
  // MongoDB's TTL index may take a little time to remove the document.
  if (otpDoc.expiresAt.getTime() < Date.now()) {
    await OTP.deleteOne({ _id: otpDoc._id });

    throw new ApiError(400, "OTP has expired. Please request a new OTP.");
  }

  // Stop verification after too many incorrect attempts.
  if (otpDoc.attempts >= MAX_ATTEMPTS) {
    await OTP.deleteOne({ _id: otpDoc._id });

    throw new ApiError(
      429,
      "Too many failed attempts. Please request a new OTP.",
    );
  }

  // Hash the submitted OTP using the same HMAC secret used
  // when the OTP was originally created.
  const submittedHash = crypto
    .createHmac("sha256", env.OTP_SECRET)
    .update(otp)
    .digest("hex");

  const submittedBuffer = Buffer.from(submittedHash, "hex");
  const storedBuffer = Buffer.from(otpDoc.codeHash, "hex");

  const isValid = crypto.timingSafeEqual(submittedBuffer, storedBuffer);

  if (!isValid) {
    otpDoc.attempts += 1;
    await otpDoc.save();

    const attemptsLeft = MAX_ATTEMPTS - otpDoc.attempts;

    throw new ApiError(400, "Incorrect OTP.", [{ attemptsLeft }]);
  }

  /*
   * OTP is now successfully verified.
   *
   * Delete it immediately so it cannot be reused.
   */
  await OTP.deleteOne({
    _id: otpDoc._id,
  });

  /*
   * Generate a short-lived token that proves the user
   * successfully completed password-reset OTP verification.
   *
   * This token is NOT an access token.
   * It can only be used by the password-reset endpoint.
   */
  const passwordResetToken = jwt.sign(
    {
      userId: user._id.toString(),
      purpose: "PASSWORD_RESET",
    },
    env.PASSWORD_RESET_TOKEN_SECRET,
    {
      expiresIn: env.PASSWORD_RESET_TOKEN_EXPIRATION,
    },
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        passwordResetToken,
      },
      "OTP verified successfully.",
    ),
  );
});

export const resetPassword = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Password reset token is missing.");
  }

  const passwordResetToken = authHeader.split(" ")[1];

  let payload;

  try {
    payload = jwt.verify(passwordResetToken, env.PASSWORD_RESET_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Password reset token is invalid or expired.");
  }

  // Make sure this JWT was specifically created for password reset.
  if (payload.purpose !== "PASSWORD_RESET") {
    throw new ApiError(401, "Invalid password reset token.");
  }

  const { newPassword, confirmPassword } = req.body;

  if (!newPassword || !confirmPassword) {
    throw new ApiError(400, "New password and confirm password are required.");
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match.");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters.");
  }

  const user = await User.findById(payload.userId).select("+password");

  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  // Prevent resetting to the same password.
  const isSamePassword = await user.comparePassword(newPassword);

  if (isSamePassword) {
    throw new ApiError(
      400,
      "New password must be different from your current password.",
    );
  }

  /*
   * Assign the plain password.
   *
   * The User model's pre("save") hook will automatically
   * hash it with bcrypt before saving.
   */
  user.password = newPassword;

  await user.save();

  /*
   * Password reset invalidates every existing login session.
   *
   * This logs the user out from every device.
   */
  await RefreshToken.deleteMany({
    user: user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset successfully. Please log in again.",
      ),
    );
});
