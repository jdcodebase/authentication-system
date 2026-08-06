import { MdRefresh } from "react-icons/md";

const DashboardActions = ({ loading, refresh }) => {
  return (
    <div className="mt-8">
      <button
        onClick={refresh}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-indigo-400"
      >
        <MdRefresh size={22} />
        {loading ? "Please wait..." : "Refresh Profile"}
      </button>
    </div>
  );
};

export default DashboardActions;
