import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => (
  <footer className="bg-green-500">
    <nav className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
      {/* Logo */}
      <div className="text-white text-l">
        <Link to="/">
          © 2024 <b>ぷぴぽ</b>™ PLC. All rights reserved.{" "}
        </Link>
      </div>
    </nav>
  </footer>
);

export default Footer;
