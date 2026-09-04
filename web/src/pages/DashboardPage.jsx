import { useAuth } from "../context/AuthContext";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900">
          Welcome back, {user?.name?.split(" ")[0]}
        </h2>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Your Profile
          </h3>

          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-900">{user?.email}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Phone</dt>
              <dd className="font-medium text-gray-900">{user?.phone}</dd>
            </div>
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <dt className="text-gray-500">Date of Birth</dt>
              <dd className="font-medium text-gray-900">
                {user?.dateOfBirth
                  ? new Date(user.dateOfBirth).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
