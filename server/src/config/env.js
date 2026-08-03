import dotenv from "dotenv";
dotenv.config();

const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  CLIENT_URL: process.env.CLIENT_URL,
  PORT: process.env.PORT || 8000,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRATION: process.env.ACCESS_TOKEN_EXPIRATION,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION,
  NODE_ENV: process.env.NODE_ENV || "development",
};

export default env;
