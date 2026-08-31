import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-10 text-center">
      <span className="mb-4 rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-600">
        Secure Authentication Project
      </span>

      <h2 className="max-w-3xl text-5xl font-extrabold leading-tight text-gray-900">
        Build Secure Authentication with
        <span className="text-indigo-600"> React & Node.js</span>
      </h2>

      <p className="mt-6 max-w-2xl text-lg text-gray-600">
        A complete authentication system using JWT, Refresh Tokens, HttpOnly
        Cookies, bcrypt, and Protected Routes built with modern web
        technologies.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link
          to="/register"
          className="rounded-xl bg-indigo-600 px-8 py-3 text-lg font-semibold text-white transition hover:bg-indigo-700"
        >
          Get Started
        </Link>

        <Link
          to="/login"
          className="rounded-xl border border-indigo-600 px-8 py-3 text-lg font-semibold text-indigo-600 transition hover:bg-indigo-50"
        >
          Login
        </Link>
      </div>
    </section>
  );
};

export default Hero;
