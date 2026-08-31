import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { HiDesktopComputer, HiDeviceMobile } from "react-icons/hi";

import { getDevices, revokeDevice } from "../services/auth.service";
import DashboardNavbar from "../components/dashboard/DashboardNavbar";
import { getDeviceId } from "../utils/device";

const formatRelativeTime = (dateString) => {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const DevicesPage = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);

  const currentDeviceId = getDeviceId();

  const fetchDevices = async () => {
    try {
      const { data } = await getDevices();
      console.log(data);
      setDevices(data.data.devices);
    } catch (error) {
      toast.error("Failed to load devices.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleRevoke = async (sessionId) => {
    setRevokingId(sessionId);
    try {
      await revokeDevice(sessionId);
      setDevices((prev) => prev.filter((d) => d._id !== sessionId));
      toast.success("Device logged out.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to log out device.");
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar />

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900">Manage Devices</h2>
        <p className="mt-1 text-sm text-gray-500">
          These are the devices currently signed in to your account.
        </p>

        <div className="mt-8 space-y-3">
          {loading && <p className="text-gray-500">Loading devices...</p>}

          {!loading && devices.length === 0 && (
            <p className="text-gray-500">No active devices found.</p>
          )}

          {devices.map((device) => {
            const isCurrent = device.deviceId === currentDeviceId;

            return (
              <div
                key={device._id}
                className="flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                    {device.deviceType === "web" ? (
                      <HiDesktopComputer className="text-xl" />
                    ) : (
                      <HiDeviceMobile className="text-xl" />
                    )}
                  </div>

                  <div>
                    <p className="font-medium text-gray-900">
                      {device.deviceName || "Unknown device"}
                      {isCurrent && (
                        <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          This device
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last active {formatRelativeTime(device.lastUsedAt)}
                    </p>
                  </div>
                </div>

                {!isCurrent && (
                  <button
                    onClick={() => handleRevoke(device._id)}
                    disabled={revokingId === device._id}
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                  >
                    {revokingId === device._id ? "Logging out..." : "Logout"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DevicesPage;
