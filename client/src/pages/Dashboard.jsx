import DashboardHeader from "../components/dashboard/DashboardHeader";
import ProfileCard from "../components/dashboard/ProfileCard";
import DashboardActions from "../components/dashboard/DashboardActions";

const Dashboard = () => {
  const user = {
    name: "John Doe",
    email: "john@example.com",
    createdAt: "03 Aug 2026",
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-blue-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardHeader user={user} />

        <ProfileCard user={user} />

        <DashboardActions />
      </div>
    </div>
  );
};

export default Dashboard;
