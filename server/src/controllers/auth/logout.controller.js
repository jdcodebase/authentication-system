import RefreshToken from "../../models/refreshToken.model.js";

import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import env from "../../config/env.js";

import { hashToken } from "../../utils/token.util.js";

export const logout = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (incomingRefreshToken) {
    const tokenHash = hashToken(incomingRefreshToken);

    // Only deletes the session matching THIS exact token — other devices unaffected
    await RefreshToken.deleteOne({
      user: req.user._id,
      tokenHash,
    });
  }

  // Clear the cookie regardless — safe no-op on mobile where there's no cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Logged out successfully."));
});

export const logoutAllDevices = asyncHandler(async (req, res) => {
  const result = await RefreshToken.deleteMany({ user: req.user._id });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { revokedSessions: result.deletedCount },
        "Logged out from all devices successfully.",
      ),
    );
});
