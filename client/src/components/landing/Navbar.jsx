import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <h1 className="text-xl font-bold text-indigo-600">
          Authentication System
        </h1>

        {/* Desktop */}
        <div className="hidden items-center gap-4 md:flex">
          <Link
            to="/login"
            className="rounded-lg border border-indigo-600 px-5 py-2 text-indigo-600 transition hover:bg-indigo-50"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-indigo-600 px-5 py-2 text-white transition hover:bg-indigo-700"
          >
            Register
          </Link>
        </div>

        {/* Mobile */}
        <button
          onClick={() => setOpen(!open)}
          className="text-3xl text-indigo-600 md:hidden"
        >
          {open ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {open && (
        <div className="space-y-3 border-t bg-white px-4 py-4 md:hidden">
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block rounded-lg border border-indigo-600 px-4 py-3 text-center text-indigo-600"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={() => setOpen(false)}
            className="block rounded-lg bg-indigo-600 px-4 py-3 text-center text-white"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
