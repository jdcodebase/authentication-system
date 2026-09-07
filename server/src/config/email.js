import nodemailer from "nodemailer";
import env from "./env.js";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: env.EMAIL_PORT,
  secure: true, // SSL - more reliable on Render than STARTTLS (587)

  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS, // 16-char App Password, no spaces
  },

  // --- Timeouts: prevent hanging requests on Render's network ---
  connectionTimeout: 10000, // 10s to establish connection
  greetingTimeout: 10000, // 10s to receive greeting from Gmail
  socketTimeout: 20000, // 20s of inactivity before killing socket

  // --- Connection pooling: avoid Gmail rate-limiting/blocking ---
  pool: true,
  maxConnections: 3, // Gmail SMTP is strict; keep this low
  maxMessages: 50, // recycle connection after 50 emails
  rateDelta: 1000, // rate limiting window (ms)
  rateLimit: 5, // max 5 emails per rateDelta window
});

export default transporter;
