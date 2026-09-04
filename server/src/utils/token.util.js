import crypto from "crypto";

export const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

export const parseExpiryToMs = (expiry) => {
  const match = /^(\d+)([smhd])$/.exec(expiry);

  if (!match) {
    throw new Error(`Invalid expiration format: ${expiry}`);
  }

  const value = Number(match[1]);

  const unit = {
    s: 1000,
    m: 60000,
    h: 3600000,
    d: 86400000,
  }[match[2]];

  return value * unit;
};
