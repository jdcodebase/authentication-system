import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "EMAIL_VERIFICATION",
        "PASSWORD_RESET",
        "PASSWORD_CHANGE",
        "EMAIL_CHANGE_OLD",
        "EMAIL_CHANGE_NEW",
      ],
      required: true,
    },

    codeHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    verifiedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;
