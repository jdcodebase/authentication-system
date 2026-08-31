import { FaShieldAlt, FaCookieBite } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";

const features = [
  {
    title: "JWT Authentication",
    description: "Secure authentication using JSON Web Tokens.",
    icon: <MdSecurity className="text-4xl text-indigo-600" />,
  },
  {
    title: "Protected Routes",
    description: "Only authenticated users can access private pages.",
    icon: <FaShieldAlt className="text-4xl text-indigo-600" />,
  },
  {
    title: "HttpOnly Cookies",
    description: "Store tokens securely inside browser cookies.",
    icon: <FaCookieBite className="text-4xl text-indigo-600" />,
  },
  {
    title: "Password Hashing",
    description: "Passwords are encrypted using bcrypt.",
    icon: <RiLockPasswordFill className="text-4xl text-indigo-600" />,
  },
];

const Features = () => {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-10">
      <h3 className="mb-12 text-center text-3xl font-bold text-gray-900">
        Features
      </h3>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
          >
            <div className="mb-4 text-5xl">{feature.icon}</div>

            <h4 className="mb-2 text-xl font-semibold text-gray-800">
              {feature.title}
            </h4>

            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
