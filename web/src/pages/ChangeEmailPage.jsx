import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { HiArrowLeft, HiMail } from "react-icons/hi";

import { useAuth } from "../context/AuthContext";

import {
  sendOldEmailChangeOtp,
  verifyOldEmailChangeOtp,
  sendNewEmailChangeOtp,
  verifyNewEmailChangeOtp,
} from "../services/auth.service";

import DashboardNavbar from "../components/dashboard/DashboardNavbar";

import ChangeEmailProgress from "../components/change-email/ChangeEmailProgress";
import CurrentEmailStep from "../components/change-email/CurrentEmailStep";
import VerifyCurrentEmailStep from "../components/change-email/VerifyCurrentEmailStep";
import NewEmailStep from "../components/change-email/NewEmailStep";
import VerifyNewEmailStep from "../components/change-email/VerifyNewEmailStep";

const EMAIL_CHANGE_TOKEN_KEY = "emailChangeToken";

const ChangeEmailPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);

  const [oldOtp, setOldOtp] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newOtp, setNewOtp] = useState("");

  const [emailChangeToken, setEmailChangeToken] = useState(
    () => sessionStorage.getItem(EMAIL_CHANGE_TOKEN_KEY) || "",
  );

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const [oldRetryAfter, setOldRetryAfter] = useState(0);
  const [newRetryAfter, setNewRetryAfter] = useState(0);

  // --------------------------------------------------
  // Restore email-change flow after page refresh
  // --------------------------------------------------

  useEffect(() => {
    if (emailChangeToken) {
      setStep(3);
    }
  }, [emailChangeToken]);

  // --------------------------------------------------
  // Old OTP countdown
  // --------------------------------------------------

  useEffect(() => {
    if (oldRetryAfter <= 0) return;

    const timer = setInterval(() => {
      setOldRetryAfter((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [oldRetryAfter]);

  // --------------------------------------------------
  // New OTP countdown
  // --------------------------------------------------

  useEffect(() => {
    if (newRetryAfter <= 0) return;

    const timer = setInterval(() => {
      setNewRetryAfter((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [newRetryAfter]);

  // --------------------------------------------------
  // Step 1: Send OTP to current email
  // --------------------------------------------------

  const handleSendOldOtp = async () => {
    try {
      setLoading(true);

      const response = await sendOldEmailChangeOtp();

      setOldRetryAfter(response.data.data.retryAfter || 60);
      setStep(2);

      toast.success("OTP sent to your current email.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Step 2: Verify current email
  // --------------------------------------------------

  const handleVerifyOldOtp = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(oldOtp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyOldEmailChangeOtp({
        otp: oldOtp,
      });

      const token = response.data.data.emailChangeToken;

      if (!token) {
        throw new Error("Email change token was not returned.");
      }

      sessionStorage.setItem(EMAIL_CHANGE_TOKEN_KEY, token);

      setEmailChangeToken(token);
      setOldOtp("");
      setStep(3);

      toast.success("Current email verified.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Step 3: Send OTP to new email
  // --------------------------------------------------

  const handleSendNewOtp = async (e) => {
    e.preventDefault();

    const normalizedEmail = newEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      toast.error("Please enter your new email address.");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const storedToken = sessionStorage.getItem(EMAIL_CHANGE_TOKEN_KEY);

    if (!storedToken) {
      toast.error("Email change session expired. Please start again.");
      return;
    }

    try {
      setLoading(true);

      const response = await sendNewEmailChangeOtp(
        {
          newEmail: normalizedEmail,
        },
        storedToken,
      );

      setNewEmail(normalizedEmail);
      setNewRetryAfter(response.data.data.retryAfter || 60);
      setStep(4);

      toast.success("OTP sent to your new email.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Step 4: Verify new email
  // --------------------------------------------------

  const handleVerifyNewOtp = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(newOtp)) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    const storedToken = sessionStorage.getItem(EMAIL_CHANGE_TOKEN_KEY);

    if (!storedToken) {
      toast.error("Email change session expired. Please start again.");
      return;
    }

    try {
      setLoading(true);

      const response = await verifyNewEmailChangeOtp(
        {
          otp: newOtp,
        },
        storedToken,
      );

      sessionStorage.removeItem(EMAIL_CHANGE_TOKEN_KEY);

      setEmailChangeToken("");
      setNewOtp("");

      toast.success(response.data.message || "Email changed successfully.");

      navigate("/profile");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Resend old email OTP
  // --------------------------------------------------

  const handleResendOldOtp = async () => {
    if (oldRetryAfter > 0 || resending) return;

    try {
      setResending(true);

      const response = await sendOldEmailChangeOtp();

      setOldRetryAfter(response.data.data.retryAfter || 60);

      toast.success("A new OTP has been sent.");
    } catch (error) {
      const retryAfter = error.response?.data?.data?.[0]?.retryAfter;

      if (retryAfter) {
        setOldRetryAfter(retryAfter);
      }

      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  // --------------------------------------------------
  // Resend new email OTP
  // --------------------------------------------------

  const handleResendNewOtp = async () => {
    if (newRetryAfter > 0 || resending) return;

    const storedToken = sessionStorage.getItem(EMAIL_CHANGE_TOKEN_KEY);

    if (!storedToken) {
      toast.error("Email change session expired. Please start again.");
      return;
    }

    try {
      setResending(true);

      const response = await sendNewEmailChangeOtp(
        {
          newEmail: newEmail.trim().toLowerCase(),
        },
        storedToken,
      );

      setNewRetryAfter(response.data.data.retryAfter || 60);

      toast.success("A new OTP has been sent.");
    } catch (error) {
      const retryAfter = error.response?.data?.data?.[0]?.retryAfter;

      if (retryAfter) {
        setNewRetryAfter(retryAfter);
      }

      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  // --------------------------------------------------
  // Back navigation
  // --------------------------------------------------

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      return;
    }

    if (step === 3) {
      sessionStorage.removeItem(EMAIL_CHANGE_TOKEN_KEY);
      setEmailChangeToken("");
      setNewEmail("");
      setStep(1);
      return;
    }

    if (step === 4) {
      setStep(3);
      return;
    }

    navigate("/profile");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={handleBack}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <HiArrowLeft className="h-5 w-5" />
          Back
        </button>

        <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <HiMail className="h-6 w-6 text-blue-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900">Change Email</h1>

            <p className="mt-2 text-sm text-gray-500">
              Verify your current email and then verify your new email address.
            </p>
          </div>

          {/* Progress */}
          <ChangeEmailProgress step={step} />

          {/* Step 1 */}
          {step === 1 && (
            <CurrentEmailStep
              email={user?.email}
              loading={loading}
              onSend={handleSendOldOtp}
            />
          )}

          {/* Step 2 */}
          {step === 2 && (
            <VerifyCurrentEmailStep
              email={user?.email}
              otp={oldOtp}
              setOtp={setOldOtp}
              loading={loading}
              retryAfter={oldRetryAfter}
              resending={resending}
              onSubmit={handleVerifyOldOtp}
              onResend={handleResendOldOtp}
            />
          )}

          {/* Step 3 */}
          {step === 3 && (
            <NewEmailStep
              newEmail={newEmail}
              setNewEmail={setNewEmail}
              loading={loading}
              onSubmit={handleSendNewOtp}
            />
          )}

          {/* Step 4 */}
          {step === 4 && (
            <VerifyNewEmailStep
              newEmail={newEmail}
              otp={newOtp}
              setOtp={setNewOtp}
              loading={loading}
              retryAfter={newRetryAfter}
              resending={resending}
              onSubmit={handleVerifyNewOtp}
              onResend={handleResendNewOtp}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default ChangeEmailPage;
