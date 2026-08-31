import express from "express";

import { getProfile } from "../controllers/user/profile.controller.js";
import {
  getDevices,
  revokeDevice,
} from "../controllers/user/devices.controller.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", verifyAccessToken, getProfile);
router.get("/devices", verifyAccessToken, getDevices);
router.delete("/devices/:sessionId", verifyAccessToken, revokeDevice);

export default router;
