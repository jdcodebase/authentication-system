import User from "../../models/user.model.js";
import RefreshToken from "../../models/refreshToken.model.js";

import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import env from "../../config/env.js";

import { generateAuthTokens } from "../../utils/generateTokens.js";
import { hashToken, parseExpiryToMs } from "../../utils/token.util.js";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export const login = asyncHandler(async (req, res) => {
  const { email, password, deviceId, deviceType, deviceName } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw new ApiError(400, "Please provide a valid email address.");
  }

  if (!deviceId || !deviceType) {
    throw new ApiError(400, "Device information is required.");
  }

  if (!["web", "android", "ios"].includes(deviceType)) {
    throw new ApiError(400, "Invalid device type.");
  }

  // Need password back explicitly since the model has select: false
  const user = await User.findOne({ email: normalizedEmail }).select(
    "+password",
  );

  // Same generic message whether email doesn't exist or password is wrong —
  // prevents leaking which emails are registered.
  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(403, "Please verify your email before logging in.");
  }

  const { accessToken, refreshToken } = generateAuthTokens(user._id);

  const refreshExpiresAt = new Date(
    Date.now() + parseExpiryToMs(env.REFRESH_TOKEN_EXPIRATION),
  );

  // Same user + same device -> replace old session.
  // Same user + new device -> creates a new session (new device entry).
  await RefreshToken.findOneAndUpdate(
    { user: user._id, deviceId },
    {
      user: user._id,
      tokenHash: hashToken(refreshToken),
      deviceId,
      deviceType,
      deviceName: deviceName || null,
      ip: req.ip,
      userAgent: req.headers["user-agent"] || null,
      expiresAt: refreshExpiresAt,
      lastUsedAt: new Date(),
    },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );

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
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: userResponse, accessToken },
          "Login successful.",
        ),
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: userResponse, accessToken, refreshToken },
        "Login successful.",
      ),
    );
});
