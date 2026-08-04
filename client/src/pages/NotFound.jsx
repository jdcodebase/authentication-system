import { Link } from "react-router-dom";
import { FaExclamationTriangle, FaHome } from "react-icons/fa";

const NotFound = () => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-linear-to-br from-indigo-50 via-white to-blue-100">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100">
            <FaExclamationTriangle className="text-5xl text-red-500" />
          </div>

          <h1 className="text-6xl font-extrabold text-indigo-600">404</h1>

          <h2 className="mt-4 text-3xl font-bold text-gray-900">
            Page Not Found
          </h2>

          <p className="mt-3 text-gray-600">
            Sorry, the page you're looking for doesn't exist or may have been
            moved.
          </p>

          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
          >
            <FaHome />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
