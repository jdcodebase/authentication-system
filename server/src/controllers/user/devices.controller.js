import RefreshToken from "../../models/refreshToken.model.js";

import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const getDevices = asyncHandler(async (req, res) => {
  const sessions = await RefreshToken.find({
    user: req.user._id,
    expiresAt: { $gt: new Date() },
  })
    .select("-tokenHash")
    .sort({ lastUsedAt: -1 });

  const devices = sessions.map((session) => ({
    _id: session._id,
    deviceId: session.deviceId,
    deviceType: session.deviceType,
    deviceName: session.deviceName,
    ip: session.ip,
    lastUsedAt: session.lastUsedAt,
    createdAt: session.createdAt,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, { devices }, "Devices fetched successfully."));
});

export const revokeDevice = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const result = await RefreshToken.deleteOne({
    _id: sessionId,
    user: req.user._id,
  });

  if (result.deletedCount === 0) {
    throw new ApiError(404, "Device session not found.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Device logged out successfully."));
});
