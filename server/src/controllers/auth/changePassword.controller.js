import User from "../../models/user.model.js";
import RefreshToken from "../../models/refreshToken.model.js";

import ApiError from "../../utils/ApiError.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmPassword) {
    throw new ApiError(
      400,
      "Current password, new password, and confirm password are required.",
    );
  }

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "New passwords do not match.");
  }

  if (newPassword.length < 6) {
    throw new ApiError(400, "New password must be at least 6 characters.");
  }

  if (currentPassword === newPassword) {
    throw new ApiError(
      400,
      "New password must be different from your current password.",
    );
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  const isPasswordValid = await user.comparePassword(currentPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Current password is incorrect.");
  }

  user.password = newPassword;
  await user.save();

  // Password change invalidates all existing refresh sessions.
  await RefreshToken.deleteMany({
    user: user._id,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password changed successfully. Please log in again.",
      ),
    );
});
