import nodemailer from "nodemailer";
import env from "./env.js";

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: Number(env.EMAIL_PORT),
  secure: Number(env.EMAIL_PORT) === 465,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS,
  },
  family: 4,
  connectionTimeout: 5000, // fail fast instead of hanging
  greetingTimeout: 5000,
  socketTimeout: 5000,
});

export default transporter;
