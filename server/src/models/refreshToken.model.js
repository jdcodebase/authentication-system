import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
    },

    deviceId: {
      type: String,
      required: true,
    },

    deviceType: {
      type: String,
      enum: ["web", "android", "ios"],
      required: true,
    },

    deviceName: {
      type: String,
      default: null, // e.g. "Chrome on Windows", "Pixel 8", from User-Agent or app-provided info
    },

    ip: {
      type: String,
      default: null,
    },

    userAgent: {
      type: String,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// One active session per (user, device) — new login on same device replaces old
refreshTokenSchema.index({ user: 1, deviceId: 1 }, { unique: true });

// TTL cleanup once expired
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);

export default RefreshToken;
