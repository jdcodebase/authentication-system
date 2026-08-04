import { Link } from "react-router-dom";

const AuthFooter = ({ text, linkText, to }) => {
  return (
    <p className="mt-6 text-center text-sm text-gray-600">
      {text}{" "}
      <Link
        to={to}
        className="font-semibold text-indigo-600 transition hover:text-indigo-700 hover:underline"
      >
        {linkText}
      </Link>
    </p>
  );
};

export default AuthFooter;
