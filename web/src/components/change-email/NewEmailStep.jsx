const NewEmailStep = ({ newEmail, setNewEmail, loading, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-6">
        <div className="mb-4 flex items-center gap-2 text-green-600">
          <span className="text-xl">✓</span>
          <span className="font-semibold">Current email verified</span>
        </div>

        <label
          htmlFor="newEmail"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          New email address
        </label>

        <input
          id="newEmail"
          type="email"
          autoComplete="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter your new email"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !newEmail.trim()}
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Sending..." : "Send Verification Code"}
      </button>
    </form>
  );
};

export default NewEmailStep;
