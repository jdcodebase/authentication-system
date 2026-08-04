import { Link } from "react-router-dom";

import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Features from "../components/landing/Features";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-blue-100">
      <Navbar />

      <Hero />

      <Features />
    </div>
  );
};

export default LandingPage;
