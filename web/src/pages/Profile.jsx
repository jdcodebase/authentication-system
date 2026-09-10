import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  HiArrowLeft,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCalendar,
  HiOutlineLockClosed,
  HiOutlinePencil,
} from "react-icons/hi";

import { useAuth } from "../context/AuthContext";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const initials = user?.name
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <main className="mx-auto max-w-3xl px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-indigo-600 hover:cursor-pointer hover:underline"
          >
            <HiArrowLeft />
            Back to Dashboard
          </button>

          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage your account information and security settings.
          </p>
        </div>

        {/* Profile Card */}
        <section className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-lg font-bold text-white">
              {initials || "U"}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.name || "User"}
              </h3>

              <p className="text-sm text-gray-500">
                {user?.email || "No email available"}
              </p>
            </div>
          </div>

          {/* Account Information */}
          <div className="pt-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Account Information
            </h3>

            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-500">
                    <HiOutlinePencil className="text-xl" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">
                      {user?.name || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-500">
                    <HiOutlineMail className="text-xl" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {user?.email || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-500">
                    <HiOutlinePhone className="text-xl" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">
                      {user?.phone || "Not available"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-500">
                    <HiOutlineCalendar className="text-xl" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="font-medium text-gray-900">
                      {user?.dateOfBirth
                        ? new Date(user.dateOfBirth).toLocaleDateString()
                        : "Not available"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-lg font-semibold text-gray-900">Security</h3>

            <p className="mt-1 text-sm text-gray-500">
              Manage your password and email address.
            </p>
          </div>

          {/* Change Password */}
          <div className="flex items-center justify-between border-b border-gray-100 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <HiOutlineLockClosed className="text-xl" />
              </div>

              <div>
                <p className="font-medium text-gray-900">Password</p>
                <p className="text-sm text-gray-500">
                  Change your account password
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                navigate("/change-password");
              }}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:cursor-pointer "
            >
              Change
            </button>
          </div>

          {showPasswordForm && (
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                Change password form will be added here.
              </p>
            </div>
          )}

          {/* Change Email */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <HiOutlineMail className="text-xl" />
              </div>

              <div>
                <p className="font-medium text-gray-900">Email Address</p>
                <p className="text-sm text-gray-500">
                  Change the email associated with your account
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                navigate("/change-email");
              }}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:cursor-pointer "
            >
              Change
            </button>
          </div>

          {showEmailForm && (
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="text-sm text-gray-600">
                Change email form will be added here.
              </p>
            </div>
          )}
        </section>

        {/* Devices */}
        <section className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Active Devices
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Manage devices currently signed in to your account.
              </p>
            </div>

            <button
              onClick={() => navigate("/devices")}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 hover:cursor-pointer"
            >
              Manage
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
