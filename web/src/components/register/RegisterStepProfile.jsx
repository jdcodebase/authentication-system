import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { completeRegistration } from "../../services/auth.service";
import { getDeviceId, getDeviceType, getDeviceName } from "../../utils/device";
import { useAuth } from "../../context/AuthContext";

const RegisterStepProfile = () => {
  const navigate = useNavigate();
  const registrationName = sessionStorage.getItem("registrationName");

  const [profileData, setProfileData] = useState({
    phone: "",
    age: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const { setAuth } = useAuth();

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (profileData.password !== profileData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const registrationToken = sessionStorage.getItem("registrationToken");
    if (!registrationToken) {
      toast.error("Session expired. Please start over.");
      navigate("/register");
      return;
    }

    setLoading(true);

    try {
      await completeRegistration(
        {
          name: registrationName,
          email: sessionStorage.getItem("registrationEmail"),
          phone: profileData.phone,
          age: Number(profileData.age),
          password: profileData.password,
          confirmPassword: profileData.confirmPassword,
          deviceId: getDeviceId(),
          deviceType: getDeviceType(),
          deviceName: getDeviceName(),
        },
        registrationToken,
      );

      setAuth({ user: data.data.user, accessToken: data.data.accessToken });

      sessionStorage.removeItem("registrationToken");
      sessionStorage.removeItem("registrationName");
      sessionStorage.removeItem("registrationEmail");

      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold text-gray-900">
        Hi {registrationName || "there"} 👋
      </h1>
      <p className="mt-3 max-w-md text-gray-500">
        Just a few more details to finish setting up your account.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 max-w-md space-y-6">
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={profileData.phone}
            onChange={handleChange}
            required
            placeholder="9876543210"
            className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-600"
          />
        </div>

        <div>
          <label
            htmlFor="age"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Age
          </label>
          <input
            id="age"
            type="number"
            name="age"
            value={profileData.age}
            onChange={handleChange}
            required
            min={13}
            max={120}
            placeholder="25"
            className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-600"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={profileData.password}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="••••••••"
            className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-600"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={profileData.confirmPassword}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="••••••••"
            className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Complete Registration"}
        </button>
      </form>
    </>
  );
};

export default RegisterStepProfile;
