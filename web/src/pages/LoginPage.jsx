import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../services/auth.service";
import { getDeviceId, getDeviceType, getDeviceName } from "../utils/device";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await loginUser({
        email: formData.email,
        password: formData.password,
        deviceId: getDeviceId(),
        deviceType: getDeviceType(),
        deviceName: getDeviceName(),
      });

      // TODO: replace with AuthContext once built —
      // for now just confirming the flow works end to end.
      setAuth({ user: data.data.user, accessToken: data.data.accessToken });

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid email or password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left — form */}
      <div className="flex w-full flex-col justify-center px-8 sm:px-16 lg:w-[60%] lg:px-24">
        <h1 className="text-4xl font-extrabold text-gray-900">Welcome back</h1>
        <p className="mt-3 max-w-md text-gray-500">
          Log in to your account to continue.
        </p>

        <form onSubmit={handleSubmit} className="mt-10 max-w-md space-y-6">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="mb-2 text-sm font-medium text-indigo-600 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-8 text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Right — visual panel */}
      <div className="relative hidden overflow-hidden bg-linear-to-br from-indigo-600 to-blue-500 lg:block lg:w-[40%]">
        <div className="flex h-full flex-col items-center justify-center px-12 text-center">
          <h2 className="text-3xl font-bold text-white">Welcome back.</h2>
          <p className="mt-4 max-w-sm text-indigo-100">
            Your sessions, your devices, your control — pick up right where you
            left off.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
