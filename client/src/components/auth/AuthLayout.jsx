const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-indigo-50 via-white to-blue-100">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
        <main className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;
