import jwt from "jsonwebtoken";
import env from "../config/env.js";

const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET;
const ACCESS_TOKEN_EXPIRATION = env.ACCESS_TOKEN_EXPIRATION;

const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRATION = env.REFRESH_TOKEN_EXPIRATION;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error("JWT secrets are missing in environment variables.");
}

const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid token");
  }
};

export const generateAccessToken = (payload) => {
  return generateToken(payload, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_EXPIRATION);
};

export const generateRefreshToken = (payload) => {
  return generateToken(payload, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_EXPIRATION);
};

export const verifyAccessToken = (token) => {
  return verifyToken(token, ACCESS_TOKEN_SECRET);
};

export const verifyRefreshToken = (token) => {
  return verifyToken(token, REFRESH_TOKEN_SECRET);
};
