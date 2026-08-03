import { verifyAccessToken } from "../utils/token.utils.js";

export const authenticateToken = (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      return res.status(401).json({
        success: false,
        message: "Access token is missing.",
      });
    }

    const decoded = verifyAccessToken(accessToken);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired access token.",
    });
  }
};
