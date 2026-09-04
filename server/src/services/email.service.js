import transporter from "../config/email.js";
import env from "../config/env.js";

export const sendOtpEmail = async ({ name, email, otp }) => {
  const escapeHtml = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  const safeName = escapeHtml(name);

  await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: email,
    subject: "Verify your email - Authentication System",

    text: `Hi ${safeName},

Your email verification OTP is: ${otp}

This OTP will expire in 10 minutes.

If you did not request this OTP, please ignore this email.`,

    html: `
      <div>
        <h2>Hello ${safeName},</h2>

        <p>
          Please use the following OTP to verify your email address:
        </p>

        <h1>${otp}</h1>

        <p>
          This OTP will expire in <strong>10 minutes</strong>.
        </p>

        <p>
          If you did not request this OTP, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};
