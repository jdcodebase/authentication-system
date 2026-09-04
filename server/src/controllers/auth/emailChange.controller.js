import crypto from "crypto";
import jwt from "jsonwebtoken";

import OTP from "../../models/otp.model.js";

import { sendOtpEmail } from "../../services/email.service.js";

import env from "../../config/env.js";
import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import User from "../../models/user.model.js";

const RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export const sendOldEmailChangeOtp = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "Authentication required.");
  }

  const email = user.email;

  // Check whether a recent old-email OTP already exists.
  const existingOtp = await OTP.findOne({
    email,
    type: "EMAIL_CHANGE_OLD",
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
  const codeHash = crypto
    .createHmac("sha256", env.OTP_SECRET)
    .update(otp)
    .digest("hex");

  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

  // Replace any previous old-email-change OTP.
  await OTP.deleteMany({
    email,
    type: "EMAIL_CHANGE_OLD",
  });

  const otpDoc = await OTP.create({
    name: user.name,
    email,
    type: "EMAIL_CHANGE_OLD",
    codeHash,
    expiresAt,
    attempts: 0,
  });

  try {
    await sendOtpEmail({
      name: user.name,
      email,
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
      "OTP sent successfully to your current email address.",
    ),
  );
});

export const verifyOldEmailChangeOtp = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    throw new ApiError(400, "OTP is required.");
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new ApiError(400, "OTP must be a 6-digit code.");
  }

  const email = req.user.email;

  const otpDoc = await OTP.findOne({
    email,
    type: "EMAIL_CHANGE_OLD",
  });

  if (!otpDoc) {
    throw new ApiError(400, "No OTP request found. Please request a new OTP.");
  }

  // Defensive expiration check.
  // MongoDB TTL cleanup may not happen immediately.
  if (otpDoc.expiresAt.getTime() < Date.now()) {
    await OTP.deleteOne({ _id: otpDoc._id });

    throw new ApiError(400, "OTP has expired. Please request a new OTP.");
  }

  // Lock the OTP after too many incorrect attempts.
  if (otpDoc.attempts >= MAX_ATTEMPTS) {
    await OTP.deleteOne({ _id: otpDoc._id });

    throw new ApiError(
      429,
      "Too many failed attempts. Please request a new OTP.",
    );
  }

  // Hash submitted OTP using the same HMAC secret.
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
   * Old email has now been successfully verified.
   *
   * Delete the OTP immediately so it cannot be reused.
   */
  await OTP.deleteOne({
    _id: otpDoc._id,
  });

  /*
   * Create a short-lived token proving that the user
   * successfully verified their current email.
   *
   * This is NOT an access token.
   */
  const emailChangeToken = jwt.sign(
    {
      userId: req.user._id.toString(),
      purpose: "EMAIL_CHANGE",
    },
    env.EMAIL_CHANGE_TOKEN_SECRET,
    {
      expiresIn: env.EMAIL_CHANGE_TOKEN_EXPIRATION,
    },
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        emailChangeToken,
      },
      "Current email verified successfully.",
    ),
  );
});

export const sendNewEmailChangeOtp = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Email change token is missing.");
  }

  const emailChangeToken = authHeader.split(" ")[1];

  let payload;

  try {
    payload = jwt.verify(emailChangeToken, env.EMAIL_CHANGE_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Email change token is invalid or expired.");
  }

  // Make sure this token was specifically created for email change.
  if (payload.purpose !== "EMAIL_CHANGE") {
    throw new ApiError(401, "Invalid email change token.");
  }

  const { newEmail } = req.body;

  if (!newEmail) {
    throw new ApiError(400, "New email is required.");
  }

  const normalizedNewEmail = newEmail.trim().toLowerCase();

  if (!EMAIL_REGEX.test(normalizedNewEmail)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }

  const user = await User.findById(payload.userId);

  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  // Don't allow changing to the same email.
  if (normalizedNewEmail === user.email) {
    throw new ApiError(
      400,
      "New email must be different from your current email.",
    );
  }

  // Make sure another account isn't already using this email.
  const existingUser = await User.findOne({
    email: normalizedNewEmail,
  });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  // Check whether a recent OTP already exists for this new email.
  const existingOtp = await OTP.findOne({
    email: normalizedNewEmail,
    type: "EMAIL_CHANGE_NEW",
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

  // Generate a secure 6-digit OTP.
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Never store the plain OTP.
  const codeHash = crypto
    .createHmac("sha256", env.OTP_SECRET)
    .update(otp)
    .digest("hex");

  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

  // Replace any previous OTP for this email-change flow.
  await OTP.deleteMany({
    email: normalizedNewEmail,
    type: "EMAIL_CHANGE_NEW",
  });

  const otpDoc = await OTP.create({
    name: user.name,
    email: normalizedNewEmail,
    type: "EMAIL_CHANGE_NEW",
    codeHash,
    expiresAt,
    attempts: 0,
  });

  try {
    await sendOtpEmail({
      name: user.name,
      email: normalizedNewEmail,
      otp,
    });
  } catch (error) {
    await OTP.deleteOne({
      _id: otpDoc._id,
    });

    throw new ApiError(500, "Failed to send OTP email. Please try again.");
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        retryAfter: 60,
      },
      "OTP sent successfully to your new email address.",
    ),
  );
});

export const verifyNewEmailChangeOtp = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Email change token is missing.");
  }

  const emailChangeToken = authHeader.split(" ")[1];

  let payload;

  try {
    payload = jwt.verify(emailChangeToken, env.EMAIL_CHANGE_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Email change token is invalid or expired.");
  }

  // Make sure this token was specifically created for email change.
  if (payload.purpose !== "EMAIL_CHANGE") {
    throw new ApiError(401, "Invalid email change token.");
  }

  const { otp } = req.body;

  if (!otp) {
    throw new ApiError(400, "OTP is required.");
  }

  if (!/^\d{6}$/.test(otp)) {
    throw new ApiError(400, "OTP must be a 6-digit code.");
  }

  const user = await User.findById(payload.userId);

  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  /*
   * Find the latest OTP created for this user's
   * email-change flow.
   *
   * We use the EMAIL_CHANGE_NEW type so an OTP from
   * another flow cannot be used here.
   */
  const otpDoc = await OTP.findOne({
    type: "EMAIL_CHANGE_NEW",
  }).sort({ createdAt: -1 });

  if (!otpDoc) {
    throw new ApiError(400, "No OTP request found. Please request a new OTP.");
  }

  /*
   * The OTP contains the new email address.
   *
   * We don't trust an email address from the frontend here.
   * The email stored in this OTP is the address that was
   * actually used when the OTP was sent.
   */
  const newEmail = otpDoc.email;

  // Defensive expiration check.
  if (otpDoc.expiresAt.getTime() < Date.now()) {
    await OTP.deleteOne({ _id: otpDoc._id });

    throw new ApiError(400, "OTP has expired. Please request a new OTP.");
  }

  // Lock after too many incorrect attempts.
  if (otpDoc.attempts >= MAX_ATTEMPTS) {
    await OTP.deleteOne({ _id: otpDoc._id });

    throw new ApiError(
      429,
      "Too many failed attempts. Please request a new OTP.",
    );
  }

  // HMAC the submitted OTP using the same secret used when creating it.
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
   * OTP verified successfully.
   *
   * Delete it immediately so it cannot be reused.
   */
  await OTP.deleteOne({
    _id: otpDoc._id,
  });

  /*
   * Final security check:
   * Make sure another account hasn't registered this
   * email since we sent the OTP.
   */
  const existingUser = await User.findOne({
    email: newEmail,
    _id: { $ne: user._id },
  });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  // Update the user's email.
  user.email = newEmail;

  await user.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        email: user.email,
      },
      "Email changed successfully.",
    ),
  );
});
