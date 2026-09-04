import { useState } from "react";
import { Link } from "react-router-dom";

import RegisterStepBasicInfo from "../components/register/RegisterStepBasicInfo";
import RegisterStepOtp from "../components/register/RegisterStepOtp";
import RegisterStepProfile from "../components/register/RegisterStepProfile";

const RegisterPage = () => {
  const [step, setStep] = useState(() =>
    localStorage.getItem("registrationToken") ? 3 : 1,
  );
  const [formData, setFormData] = useState({ name: "", email: "" });

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex w-full flex-col justify-center px-8 sm:px-16 lg:w-[60%] lg:px-24">
        <p className="mb-2 text-sm font-medium text-indigo-600">
          Step {step} of 3
        </p>

        {step === 1 && (
          <RegisterStepBasicInfo
            formData={formData}
            setFormData={setFormData}
            onSuccess={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <RegisterStepOtp formData={formData} onSuccess={() => setStep(3)} />
        )}

        {step === 3 && <RegisterStepProfile />}

        <p className="mt-8 text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>

      <div className="relative hidden overflow-hidden bg-linear-to-br from-indigo-600 to-blue-500 lg:block lg:w-[40%]">
        <div className="flex h-full flex-col items-center justify-center px-12 text-center">
          <h2 className="text-3xl font-bold text-white">Secure by design.</h2>
          <p className="mt-4 max-w-sm text-indigo-100">
            JWT access tokens, rotating refresh tokens, and per-device sessions
            — built to keep your account safe on every device.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
