const CurrentEmailStep = ({ email, loading, onSend }) => {
  return (
    <div>
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Current email
        </p>

        <p className="mt-1 break-all font-medium text-gray-900">{email}</p>
      </div>

      <button
        type="button"
        onClick={onSend}
        disabled={loading}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Verification Code"}
      </button>
    </div>
  );
};

export default CurrentEmailStep;
