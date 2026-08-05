import DashboardHeader from "../components/dashboard/DashboardHeader";
import ProfileCard from "../components/dashboard/ProfileCard";
import DashboardActions from "../components/dashboard/DashboardActions";
import { toast } from "react-hot-toast";
import { getProfile, logoutUser } from "../services/authService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    setLoading(true);

    try {
      const res = await getProfile();
      setUser(res.data.data);
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to load profile.");

      if (error.response?.status === 401) {
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logoutUser();

      navigate("/login");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-blue-100">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <DashboardHeader user={user} loading={loading} logout={handleLogout} />

        <ProfileCard user={user} />

        <DashboardActions loading={loading} logout={handleLogout} />
      </div>
    </div>
  );
};

export default Dashboard;
