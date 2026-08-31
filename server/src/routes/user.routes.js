import express from "express";

import { getProfile } from "../controllers/user/profile.controller.js";
import { verifyAccessToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/profile", verifyAccessToken, getProfile);

export default router;
