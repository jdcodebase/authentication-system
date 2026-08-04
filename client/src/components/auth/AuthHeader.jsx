const AuthHeader = ({ icon, title, subtitle }) => {
  return (
    <div className="mb-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
        {icon}
      </div>

      <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

      <p className="mt-2 text-gray-500">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;
