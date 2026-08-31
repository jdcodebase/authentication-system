import jwt from "jsonwebtoken";

import User from "../../models/user.model.js";
import RefreshToken from "../../models/refreshToken.model.js";

import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import env from "../../config/env.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/generateTokens.js";
import { hashToken, parseExpiryToMs } from "../../utils/token.util.js";

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token is missing.");
  }

  let payload;
  try {
    payload = jwt.verify(incomingRefreshToken, env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(
      401,
      "Invalid or expired refresh token. Please log in again.",
    );
  }

  const tokenHash = hashToken(incomingRefreshToken);

  const session = await RefreshToken.findOne({
    user: payload.userId,
    tokenHash,
  });

  if (!session) {
    throw new ApiError(401, "Session has been revoked. Please log in again.");
  }

  const user = await User.findById(payload.userId);

  if (!user) {
    await RefreshToken.deleteOne({ _id: session._id });
    throw new ApiError(401, "User no longer exists.");
  }

  const newAccessToken = generateAccessToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  const newExpiresAt = new Date(
    Date.now() + parseExpiryToMs(env.REFRESH_TOKEN_EXPIRATION),
  );

  session.tokenHash = hashToken(newRefreshToken);
  session.expiresAt = newExpiresAt;
  session.lastUsedAt = new Date();
  await session.save();

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    age: user.age,
    isEmailVerified: user.isEmailVerified,
  };

  if (session.deviceType === "web") {
    res.cookie("refreshToken", newRefreshToken, {
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
          { user: userResponse, accessToken: newAccessToken },
          "Token refreshed.",
        ),
      );
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        user: userResponse,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
      "Token refreshed.",
    ),
  );
});
