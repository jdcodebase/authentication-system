import { useState } from "react";
import toast from "react-hot-toast";

import { sendRegistrationOtp } from "../../services/auth.service";

const RegisterStepBasicInfo = ({ formData, setFormData, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await sendRegistrationOtp(formData);
      toast.success("OTP sent to your email.");
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-4xl font-extrabold text-gray-900">
        Create your account
      </h1>
      <p className="mt-3 max-w-md text-gray-500">
        Let's start with your name and email. We'll send a one-time code to
        verify it's really you.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 max-w-md space-y-6">
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2.5 text-gray-900 outline-none placeholder:text-gray-400 focus:border-indigo-600"
          />
        </div>

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

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
      </form>
    </>
  );
};

export default RegisterStepBasicInfo;
