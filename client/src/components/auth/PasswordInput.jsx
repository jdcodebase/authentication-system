import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const PasswordInput = ({ label, placeholder, icon, value, onChange, name }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <label
        htmlFor={name}
        className="mb-2 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-gray-300 px-4 transition focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500">
        {icon}

        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent px-3 py-3 outline-none"
          required
        />

        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="text-gray-500 hover:text-indigo-600 select-none"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
