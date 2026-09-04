import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  // req.user was attached by the verifyAccessToken middleware
  const userResponse = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    dateOfBirth: req.user.dateOfBirth,
    createdAt: req.user.createdAt,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { user: userResponse },
        "Profile fetched successfully.",
      ),
    );
});
