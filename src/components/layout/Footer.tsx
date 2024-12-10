import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white border border-t">
      <nav className="flex items-center justify-between h-12 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="text-brown text-l">
          <Link to="/">
            © 2024 <b>Mugi</b>™
          </Link>
        </div>
        {/* Other links */}
        <div className="text-brown text-r">
          <Link to="/privacy">
            {t("footer.privacy")}
          </Link>
        </div>
      </nav>
    </footer>
  );
}

export default Footer;
