import { MdRefresh } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";

const DashboardActions = () => {
  return (
    <div className="mt-8 flex flex-col gap-4 sm:flex-row">
      <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700">
        <MdRefresh size={22} />
        Refresh Profile
      </button>

      <button className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 py-3 font-semibold text-white transition hover:bg-red-600">
        <FiLogOut size={20} />
        Logout
      </button>
    </div>
  );
};

export default DashboardActions;
