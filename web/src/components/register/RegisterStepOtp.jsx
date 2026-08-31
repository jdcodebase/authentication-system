import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

import {
  sendRegistrationOtp,
  verifyRegistrationOtp,
} from "../../services/auth.service";

const RegisterStepOtp = ({ email, onSuccess }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [resendTimer, setResendTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(
      () => setResendTimer((prev) => prev - 1),
      1000,
    );
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setLoading(true);

    try {
      await sendRegistrationOtp({ email });
      toast.success("OTP resent to your email.");
      setResendTimer(60);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value.slice(-1);
    setOtp(updated);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    const pasted = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasted)) return;
    e.preventDefault();
    setOtp(pasted.split(""));
    inputRefs.current[5]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      toast.error("Please enter the full 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      const { data } = await verifyRegistrationOtp({ email, otp: code });

      sessionStorage.setItem("registrationToken", data.data.registrationToken);
      sessionStorage.setItem("registrationName", data.data.name);
      sessionStorage.setItem("registrationEmail", data.data.email);

      toast.success("Email verified successfully.");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold text-gray-900">
        Verify your email
      </h1>
      <p className="mt-3 max-w-md text-gray-500">
        We've sent a 6-digit code to{" "}
        <span className="font-medium text-gray-900">{email}</span>. Enter it
        below to continue.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 max-w-md space-y-6">
        <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(e.target.value, index)}
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
              className="h-14 w-12 rounded-lg border border-gray-300 text-center text-xl font-semibold outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Didn't receive the code?{" "}
          {resendTimer > 0 ? (
            <span className="text-gray-400">Resend in {resendTimer}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResendOtp}
              className="font-medium text-indigo-600 hover:underline"
            >
              Resend OTP
            </button>
          )}
        </p>
      </form>
    </>
  );
};

export default RegisterStepOtp;
