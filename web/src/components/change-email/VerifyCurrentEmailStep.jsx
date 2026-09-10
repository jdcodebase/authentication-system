import { HiOutlineShieldCheck } from "react-icons/hi";

const VerifyCurrentEmailStep = ({
  email,
  otp,
  setOtp,
  loading,
  retryAfter,
  resending,
  onSubmit,
  onResend,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-6 text-center">
        <HiOutlineShieldCheck className="mx-auto h-10 w-10 text-blue-600" />

        <h2 className="mt-3 text-lg font-semibold text-gray-900">
          Verify Current Email
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Enter the 6-digit code sent to
        </p>

        <p className="mt-1 break-all font-medium text-gray-900">{email}</p>
      </div>

      <input
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
        placeholder="Enter 6-digit OTP"
        className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-xl tracking-[0.5em] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <button
        type="submit"
        disabled={loading || otp.length !== 6}
        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Verifying..." : "Verify Email"}
      </button>

      <button
        type="button"
        onClick={onResend}
        disabled={retryAfter > 0 || resending}
        className="mt-4 w-full text-sm font-medium text-blue-600 disabled:cursor-not-allowed disabled:text-gray-400 hover:cursor-pointer"
      >
        {retryAfter > 0
          ? `Resend code in ${retryAfter}s`
          : resending
            ? "Sending..."
            : "Resend Code"}
      </button>
    </form>
  );
};

export default VerifyCurrentEmailStep;
