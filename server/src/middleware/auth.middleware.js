import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import env from "../config/env.js";

export const verifyAccessToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Access token is missing.");
  }

  const accessToken = authHeader.split(" ")[1];

  let payload;
  try {
    payload = jwt.verify(accessToken, env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token has expired.");
    }
    throw new ApiError(401, "Invalid access token.");
  }

  const user = await User.findById(payload.userId);

  if (!user) {
    throw new ApiError(401, "User no longer exists.");
  }

  req.user = user;
  next();
});
