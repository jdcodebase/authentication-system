import { FaEnvelope, FaLock, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";
import AuthHeader from "../components/auth/AuthHeader";
import AuthInput from "../components/auth/AuthInput";
import PasswordInput from "../components/auth/PasswordInput";
import AuthButton from "../components/auth/AuthButton";
import AuthFooter from "../components/auth/AuthFooter";

const Register = () => {
  return (
    <AuthLayout>
      <AuthHeader
        icon={<FaUser className="text-2xl text-indigo-600" />}
        title="Create Account"
        subtitle="Create your account to get started."
      />

      <form className="space-y-5">
        <AuthInput
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={<FaUser className="text-gray-400" />}
        />

        <AuthInput
          label="Email"
          type="email"
          placeholder="john@example.com"
          icon={<FaEnvelope className="text-gray-400" />}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter password"
          icon={<FaLock className="text-gray-400" />}
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm password"
          icon={<FaLock className="text-gray-400" />}
        />

        <AuthButton>Create Account</AuthButton>
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
