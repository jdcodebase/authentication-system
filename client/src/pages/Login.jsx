import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

import AuthLayout from "../components/auth/AuthLayout";
import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import PasswordInput from "../components/auth/PasswordInput";
import AuthButton from "../components/auth/AuthButton";
import AuthFooter from "../components/auth/AuthFooter";
import { useState } from "react";
import { loginUser } from "../services/authService";
import { toast } from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await loginUser(formData);

      setFormData({
        email: "",
        password: "",
      });

      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to login.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader
        icon={<FaSignInAlt className="text-2xl text-indigo-600" />}
        title="Welcome Back"
        subtitle="Login to continue to your account."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Email"
          type="email"
          placeholder="john@example.com"
          icon={<FaEnvelope className="text-gray-400" />}
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter password"
          icon={<FaLock className="text-gray-400" />}
          name="password"
          value={formData.password}
          onChange={handleChange}
        />

        <AuthButton loading={loading}>Login</AuthButton>
      </form>

      <div className="my-6 flex items-center">
        <div className="h-px flex-1 bg-gray-300"></div>
        <span className="px-3 text-sm text-gray-500">OR</span>
        <div className="h-px flex-1 bg-gray-300"></div>
      </div>

      <AuthFooter
        text="Don't have an account?"
        linkText="Create Account"
        to="/register"
      />
    </AuthLayout>
  );
};

export default Login;
