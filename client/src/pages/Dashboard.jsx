import { useNavigate } from "react-router-dom";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import ProfileCard from "../components/dashboard/ProfileCard";
import DashboardActions from "../components/dashboard/DashboardActions";

import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout, loading, checkAuth } = useAuth();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();

    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-blue-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardHeader user={user} loading={loading} logout={handleLogout} />

        <ProfileCard user={user} />

        <DashboardActions loading={loading} refresh={checkAuth} />
      </div>
    </div>
  );
};

export default Dashboard;
