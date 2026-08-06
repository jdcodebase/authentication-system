const AuthInput = ({
  label,
  type,
  placeholder,
  icon,
  value,
  onChange,
  name,
}) => {
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
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent px-3 py-3 outline-none"
          required
        />
      </div>
    </div>
  );
};

export default AuthInput;
