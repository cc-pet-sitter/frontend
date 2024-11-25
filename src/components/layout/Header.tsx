import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useTranslation } from "react-i18next";

const lngs: Record<string, { nativeName: string }> = {
  en: { nativeName: "English" },
  ja: { nativeName: "日本語" },
};

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("login");
    } catch (err) {
      console.error("Failed to logout: ", err);
    }
  };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  return (
    <header className="bg-green-500">
      <nav className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="text-white text-xl font-bold">
          <Link to="/">ぷぴぽ</Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/login" className="text-white">
            {t("header.login")}
          </Link>
          <Link to="/signup" className="text-white">
            {t("header.signup")}
          </Link>
          {currentUser && (
            <div className="space-x-4">
              <button
                onClick={handleLogout}
                className="text-white hover:underline"
              >
                {t("header.logout")}
              </button>
              <Link to="/dashboard" className="text-white">
                {t("header.dashboard")}
              </Link>
            </div>
          )}
          <div className="flex space-x-2">
            {Object.keys(lngs).map((lng) => (
              <button
                className="text-white border border-white px-2 py-1 rounded hover:bg-white hover:text-green-500"
                type="submit"
                key={lng}
                onClick={() => i18n.changeLanguage(lng)}
                disabled={i18n.resolvedLanguage === lng}
              >
                {lngs[lng].nativeName}
              </button>
            ))}
          </div>
        </div>

        {/* Hamburger Menu */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:hidden bg-green-500 px-4 py-2 space-y-2`}
      >
        <Link to="/login" className="text-white block">
          {t("header.login")}
        </Link>
        <Link to="/signup" className="text-white block">
          {t("header.signup")}
        </Link>
        {currentUser ? (
          <>
            <p className="text-white">
              {t("header.welcome")} {currentUser?.email}!
            </p>
            <button
              onClick={handleLogout}
              className="text-white block hover:underline"
            >
              {t("header.logout")}
            </button>
            <Link to="/dashboard" className="text-white block">
              {t("header.dashboard")}
            </Link>
          </>
        ) : (
          <p className="text-white block">{t("header.justVisiting")}</p>
        )}
        <div className="flex flex-wrap gap-2">
          {Object.keys(lngs).map((lng) => (
            <button
              className="text-white border border-white px-2 py-1 rounded hover:bg-white hover:text-green-500"
              type="submit"
              key={lng}
              onClick={() => i18n.changeLanguage(lng)}
              disabled={i18n.resolvedLanguage === lng}
            >
              {lngs[lng].nativeName}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
