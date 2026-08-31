import crypto from "crypto";
import jwt from "jsonwebtoken";

import User from "../../models/user.model.js";
import OTP from "../../models/otp.model.js";

import { sendOtpEmail } from "../../services/email.service.js";
import env from "../../config/env.js";

import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { generateAuthTokens } from "../../utils/generateTokens.js";
import { hashToken, parseExpiryToMs } from "../../utils/token.util.js";
import RefreshToken from "../../models/refreshToken.model.js";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_EXPIRY_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

export const sendRegistrationOtp = asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  // Validate required fields
  if (!name || !email) {
    throw new ApiError(400, "Name and email are required.");
  }

  const normalizedName = name.trim().slice(0, 50);
  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedName.length < 2) {
    throw new ApiError(400, "Name must be at least 2 characters.");
  }

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }

  // Check whether email is already registered
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  // Find latest registration OTP
  const existingOtp = await OTP.findOne({
    email: normalizedEmail,
    type: "EMAIL_VERIFICATION",
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

  // Generate a new 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Hash OTP with a server secret (HMAC) instead of a plain hash.
  // A plain SHA-256 hash of a 6-digit code can be brute-forced instantly
  // (only 900,000 possibilities) if the DB is ever exposed — HMAC requires
  // the attacker to also have OTP_SECRET.
  const codeHash = crypto
    .createHmac("sha256", env.OTP_SECRET)
    .update(otp)
    .digest("hex");

  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

  // Replace any previous OTP for this email/type
  await OTP.deleteMany({
    email: normalizedEmail,
    type: "EMAIL_VERIFICATION",
  });

  const otpDoc = await OTP.create({
    name: normalizedName,
    email: normalizedEmail,
    type: "EMAIL_VERIFICATION",
    codeHash,
    expiresAt,
    attempts: 0,
  });

  // Send the email; if it fails, roll back the OTP so the user isn't
  // stuck waiting out the cooldown for a code they never received.
  try {
    await sendOtpEmail({
      name: normalizedName,
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
      "OTP sent successfully to your email.",
    ),
  );
});

export const verifyRegistrationOtp = asyncHandler(async (req, res) => {
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

  const otpDoc = await OTP.findOne({
    email: normalizedEmail,
    type: "EMAIL_VERIFICATION",
  });

  if (!otpDoc) {
    throw new ApiError(400, "No OTP request found. Please request a new one.");
  }

  // Expired (defensive check — TTL index should already clean these up,
  // but the doc could still exist for a moment right at the boundary)
  if (otpDoc.expiresAt.getTime() < Date.now()) {
    await OTP.deleteOne({ _id: otpDoc._id });
    throw new ApiError(400, "OTP has expired. Please request a new one.");
  }

  // Lockout after too many wrong attempts
  if (otpDoc.attempts >= MAX_ATTEMPTS) {
    await OTP.deleteOne({ _id: otpDoc._id });
    throw new ApiError(
      429,
      "Too many failed attempts. Please request a new OTP.",
    );
  }

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

  // Double-check email hasn't been registered in the meantime
  // (e.g., two tabs, or a race between verify and another registration)
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    await OTP.deleteOne({ _id: otpDoc._id });
    throw new ApiError(409, "An account with this email already exists.");
  }

  const { name } = otpDoc;

  // OTP is single-use — delete it now that verification succeeded
  await OTP.deleteOne({ _id: otpDoc._id });

  // Short-lived token carrying name + email, so the frontend can
  // survive a page refresh during the registration flow.
  const registrationToken = jwt.sign(
    { name, email: normalizedEmail },
    env.REGISTRATION_TOKEN_SECRET,
    { expiresIn: env.REGISTRATION_TOKEN_EXPIRATION },
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        registrationToken,
        name,
        email: normalizedEmail,
      },
      "Email verified successfully.",
    ),
  );
});

export const completeRegistration = asyncHandler(async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Registration token is missing.");
  }

  const registrationToken = authHeader.split(" ")[1];

  let payload;
  try {
    payload = jwt.verify(registrationToken, env.REGISTRATION_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(401, "Registration token is invalid or expired.");
  }

  // Trusted source of truth — never overwritten by req.body
  const { name, email } = payload;

  const {
    name: bodyName,
    email: bodyEmail,
    phone,
    age,
    password,
    confirmPassword,
    deviceId,
    deviceType,
    deviceName,
  } = req.body;

  // Sanity check only — catches stale frontend state, doesn't grant trust
  if (
    (bodyName && bodyName.trim() !== name) ||
    (bodyEmail && bodyEmail.trim().toLowerCase() !== email)
  ) {
    throw new ApiError(
      400,
      "Submitted name/email doesn't match the verified session. Please restart registration.",
    );
  }

  if (!phone || !age || !password || !confirmPassword) {
    throw new ApiError(
      400,
      "Phone, age, password, and confirm password are required.",
    );
  }

  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match.");
  }

  if (!deviceId || !deviceType) {
    throw new ApiError(400, "Device information is required.");
  }

  if (!["web", "android", "ios"].includes(deviceType)) {
    throw new ApiError(400, "Invalid device type.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  const user = await User.create({
    name,
    email,
    phone,
    age,
    password, // hashed via User model's pre("save") hook
    isEmailVerified: true,
  });

  const { accessToken, refreshToken } = generateAuthTokens(user._id);

  const refreshExpiresAt = new Date(
    Date.now() + parseExpiryToMs(env.REFRESH_TOKEN_EXPIRATION),
  );

  // Brand-new user — create() is correct here, no existing session to replace
  await RefreshToken.create({
    user: user._id,
    tokenHash: hashToken(refreshToken),
    deviceId,
    deviceType,
    deviceName: deviceName || null,
    ip: req.ip,
    userAgent: req.headers["user-agent"] || null,
    expiresAt: refreshExpiresAt,
    lastUsedAt: new Date(),
  });

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    age: user.age,
    isEmailVerified: user.isEmailVerified,
  };

  if (deviceType === "web") {
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseExpiryToMs(env.REFRESH_TOKEN_EXPIRATION),
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { user: userResponse, accessToken },
          "Registration successful.",
        ),
      );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: userResponse, accessToken, refreshToken },
        "Registration successful.",
      ),
    );
});
