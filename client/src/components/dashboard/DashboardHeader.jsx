import { FiLogOut } from "react-icons/fi";

const DashboardHeader = ({ user, loading, logout }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        <p className="mt-2 text-gray-600">
          Welcome back,
          <span className="font-semibold text-indigo-600">
            {user?.name || "User"}
          </span>{" "}
          👋
        </p>
      </div>

      <button
        className="flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600"
        onClick={logout}
      >
        <FiLogOut />
        {loading ? "Please Wait" : "Logout"}
      </button>
    </div>
  );
};

export default DashboardHeader;
