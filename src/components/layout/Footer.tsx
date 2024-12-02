import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => (
  <footer className="bg-white border border-t">
    <nav className="flex items-center justify-between h-12 px-4 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="text-brown text-l">
        <Link to="/">
          © 2024 <b>むぎ (Mugi)</b>™
        </Link>
      </div>
    </nav>
  </footer>
);

export default Footer;
