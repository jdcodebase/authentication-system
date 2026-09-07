import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  sendForgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
} from "../services/auth.service";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState(
    () => sessionStorage.getItem("passwordResetToken") || "",
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const token = sessionStorage.getItem("passwordResetToken");

    if (!token) {
      setStep(1);
    } else {
      setStep(3);
    }
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendForgotPasswordOtp({ email });

      toast.success("OTP sent to your email.");
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await verifyForgotPasswordOtp({
        email,
        otp,
      });

      const passwordResetToken = data.data.passwordResetToken;

      sessionStorage.setItem("passwordResetToken", passwordResetToken);

      setResetToken(passwordResetToken);

      toast.success("OTP verified successfully.");
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await resetPassword(
        {
          newPassword: password,
          confirmPassword,
        },
        resetToken,
      );

      sessionStorage.removeItem("passwordResetToken");

      toast.success("Password reset successfully.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex w-full flex-col justify-center px-8 sm:px-16 lg:w-[60%] lg:px-24">
        <div className="w-full max-w-md">
          {step === 1 && (
            <>
              <h1 className="text-4xl font-extrabold text-gray-900">
                Forgot password?
              </h1>

              <p className="mt-3 text-gray-500">
                Enter your email address and we'll send you a verification code.
              </p>

              <form onSubmit={handleSendOtp} className="mt-10 space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="text-4xl font-extrabold text-gray-900">
                Verify your email
              </h1>

              <p className="mt-3 text-gray-500">
                Enter the 6-digit OTP sent to{" "}
                <span className="font-medium text-gray-900">{email}</span>.
              </p>

              <form onSubmit={handleVerifyOtp} className="mt-10 space-y-6">
                <div>
                  <label
                    htmlFor="otp"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    OTP
                  </label>

                  <input
                    id="otp"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (/^\d*$/.test(value)) {
                        setOtp(value);
                      }
                    }}
                    required
                    placeholder="123456"
                    className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-center text-xl tracking-[0.5em] text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </form>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="mt-4 w-full text-sm font-medium text-indigo-600 hover:underline"
              >
                Change email
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="text-4xl font-extrabold text-gray-900">
                Reset your password
              </h1>

              <p className="mt-3 text-gray-500">
                Enter your new password below.
              </p>

              <form onSubmit={handleResetPassword} className="mt-10 space-y-6">
                <div>
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    New Password
                  </label>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Confirm Password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-600"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </>
          )}

          <p className="mt-8 text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:underline"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-linear-to-br from-indigo-600 to-blue-500 lg:block lg:w-[40%]">
        <div className="flex h-full flex-col items-center justify-center px-12 text-center">
          <h2 className="text-3xl font-bold text-white">
            Secure account recovery.
          </h2>

          <p className="mt-4 max-w-sm text-indigo-100">
            Verify your identity with a one-time code and securely create a new
            password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
