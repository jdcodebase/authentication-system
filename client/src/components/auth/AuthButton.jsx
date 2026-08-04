const AuthButton = ({ children, loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

export default AuthButton;
