import dotenv from "dotenv";

dotenv.config();

const required = [
  "MONGODB_URI",
  "OTP_SECRET",
  "ACCESS_TOKEN_SECRET",
  "REFRESH_TOKEN_SECRET",
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  OTP_SECRET: process.env.OTP_SECRET,
  CLIENT_URL: process.env.CLIENT_URL,
  PORT: process.env.PORT || 8000,

  REGISTRATION_TOKEN_SECRET: process.env.REGISTRATION_TOKEN_SECRET,
  REGISTRATION_TOKEN_EXPIRATION: process.env.REGISTRATION_TOKEN_EXPIRATION,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,

  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,

  PASSWORD_RESET_TOKEN_SECRET: process.env.PASSWORD_RESET_TOKEN_SECRET,
  PASSWORD_RESET_TOKEN_EXPIRATION: process.env.PASSWORD_RESET_TOKEN_EXPIRATION,

  EMAIL_CHANGE_TOKEN_SECRET: process.env.EMAIL_CHANGE_TOKEN_SECRET,
  EMAIL_CHANGE_TOKEN_EXPIRATION: process.env.EMAIL_CHANGE_TOKEN_EXPIRATION,

  EMAIL_HOST: process.env.EMAIL_HOST,
  EMAIL_PORT: process.env.EMAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  EMAIL_FROM: process.env.EMAIL_FROM,

  NODE_ENV: process.env.NODE_ENV,
};

export default env;
