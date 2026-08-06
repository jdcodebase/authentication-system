import { useContext, useState } from "react";

import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { toast } from "react-hot-toast";

import AuthLayout from "../components/auth/AuthLayout";
import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import PasswordInput from "../components/auth/PasswordInput";
import AuthButton from "../components/auth/AuthButton";
import AuthFooter from "../components/auth/AuthFooter";

import { registerUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const { checkAuth } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    const { fullName, email, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      await registerUser({
        name: fullName.trim(),
        email: email.trim(),
        password,
      });

      await checkAuth();

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      toast.error(error.response?.data?.message || "Failed to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        icon={<FaUser className="text-2xl text-indigo-600" />}
        title="Create Account"
        subtitle="Create your account to get started."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={<FaUser className="text-gray-400" />}
          value={formData.fullName}
          onChange={handleChange}
          name="fullName"
        />

        <AuthInput
          label="Email"
          type="email"
          placeholder="john@example.com"
          icon={<FaEnvelope className="text-gray-400" />}
          value={formData.email}
          onChange={handleChange}
          name="email"
        />

        <PasswordInput
          label="Password"
          placeholder="Enter password"
          icon={<FaLock className="text-gray-400" />}
          value={formData.password}
          onChange={handleChange}
          name="password"
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm password"
          icon={<FaLock className="text-gray-400" />}
          value={formData.confirmPassword}
          onChange={handleChange}
          name="confirmPassword"
        />

        <AuthButton loading={loading}>Create Account</AuthButton>
      </form>

      <AuthFooter
        text="Already have an account?"
        linkText="Login"
        to="/login"
      />
    </AuthLayout>
  );
};

export default Register;
