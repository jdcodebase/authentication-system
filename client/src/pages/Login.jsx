import { Link } from "react-router-dom";
import { FaEnvelope, FaLock, FaSignInAlt } from "react-icons/fa";

import AuthLayout from "../components/auth/AuthLayout";
import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import PasswordInput from "../components/auth/PasswordInput";
import AuthButton from "../components/auth/AuthButton";
import AuthFooter from "../components/auth/AuthFooter";

const Login = () => {
  return (
    <AuthLayout>
      <AuthHeader
        icon={<FaSignInAlt className="text-2xl text-indigo-600" />}
        title="Welcome Back"
        subtitle="Login to continue to your account."
      />

      <form className="space-y-5">
        <AuthInput
          label="Email"
          type="email"
          placeholder="john@example.com"
          icon={<FaEnvelope className="text-gray-400" />}
          name="email"
        />

        <PasswordInput
          label="Password"
          placeholder="Enter password"
          icon={<FaLock className="text-gray-400" />}
          name="password"
        />

        <AuthButton>Login</AuthButton>
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
