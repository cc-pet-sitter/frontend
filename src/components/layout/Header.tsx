import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useTranslation } from "react-i18next";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";

const lngs: Record<string, { nativeName: string }> = {
  en: { nativeName: "English" },
  ja: { nativeName: "日本語" },
};

// const { userInfo } = useAuth();

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alignment, setAlignment] = React.useState("");

  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const { currentUser } = useAuth();
  const { userInfo } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("login");
    } catch (err) {
      console.error("Failed to logout: ", err);
    }
  };

  const handleButtonChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string
  ) => {
    setAlignment(newAlignment);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-green-500">
      <nav className="flex items-center justify-between h-12 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="text-white text-xl font-bold">
          <Link to="/">むぎ （Mugi）</Link>
        </div>
        <div className="flex space-x-8">
          {/* <div className="flex space-x-1"> */}
          <ToggleButtonGroup
            value={alignment}
            className="text-white border border-white px-1 py-1 rounded hover:bg-white hover:text-green-500 transition-colors duration-150 text-xs"
            exclusive
            onChange={handleButtonChange}
            aria-label="Platform"
          >
            {Object.keys(lngs).map((lng) => (
              <div
                className="inline-flex"
                role="group"
                aria-label="Button group"
                key={lng}
              >
                <ToggleButton
                  className="text-white border border-white px-1 py-1 rounded hover:bg-white hover:text-green-500 transition-colors duration-150 text-xs"
                  type="submit"
                  key={lng}
                  value={lngs[lng].nativeName}
                  onClick={() => i18n.changeLanguage(lng)}
                  disabled={i18n.resolvedLanguage === lng}
                >
                  {lngs[lng].nativeName}
                </ToggleButton>
              </div>
            ))}
          </ToggleButtonGroup>
          {/* </div> */}
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            {!currentUser ? (
              <>
                <Link to="/login" className="text-white">
                  {t("header.login")}
                </Link>
                <Link to="/signup" className="text-white">
                  {t("header.signup")}
                </Link>
              </>
            ) : (
              <>
                <div className="relative">
                  <span
                    ref={triggerRef}
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="cursor-pointer text-white"
                  >
                    {userInfo?.firstname}
                  </span>
                  {menuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-52 bg-white rounded shadow-lg z-50 p-4 space-y-2 justify-center"
                    >
                      <Link
                        to="/dashboard/account"
                        className="block px-4 py-2 hover:bg-gray-200 text-lg pb-2 border-gray"
                        onClick={toggleMenu}
                      >
                        {t("hamburger_menu.account")}
                      </Link>
                      <Link
                        to="/dashboard/bookings"
                        className="block px-4 py-2 hover:bg-gray-200 text-lg pb-4 border-b border-gray"
                        onClick={toggleMenu}
                      >
                        {t("hamburger_menu.bookings")}
                      </Link>
                      <Link
                        to="/dashboard/sitter_profile"
                        className="block px-4 py-2 hover:bg-gray-200 text-lg pb-2 pt-2 border-gray"
                        onClick={toggleMenu}
                      >
                        {userInfo?.is_sitter
                          ? t("hamburger_menu.sitter_profile")
                          : t("hamburger_menu.become_sitter")}
                      </Link>

                      <Link
                        to="/dashboard/requests"
                        className="block px-4 py-2 hover:bg-gray-200 text-lg pb-4 border-b border-gray"
                        onClick={toggleMenu}
                      >
                        {t("hamburger_menu.requests")}
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleMenu();
                        }}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-200 text-lg pt-2"
                      >
                        {t("hamburger_menu.logout")}
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger Icon */}
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
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`${
          mobileMenuOpen ? "fixed" : "hidden"
        }  md:hidden bg-green-500 px-7 py-4 space-y-2 w-full justify-center`}
      >
        {!currentUser ? (
          <div>
            <Link
              to="/login"
              className="text-white block text-lg py-2 border-white"
              onClick={toggleMobileMenu}
            >
              {t("header.login")}
            </Link>
            <Link
              to="/signup"
              className="text-white block text-lg py-2 border-white"
              onClick={toggleMobileMenu}
            >
              {t("header.signup")}
            </Link>
          </div>
        ) : (
          <>
            <Link
              to="/dashboard/account"
              className="text-white block text-lg pb-2 border-white"
              onClick={toggleMobileMenu}
            >
              {t("hamburger_menu.account")}
            </Link>
            <Link
              to="/dashboard/bookings"
              className="text-white block text-lg pb-4 border-b border-white"
              onClick={toggleMobileMenu}
            >
              {t("hamburger_menu.bookings")}
            </Link>
            <Link
              to="/dashboard/sitter_profile"
              className="text-white block text-lg pb-2 pt-2 border-white"
              onClick={toggleMobileMenu}
            >
              {userInfo?.is_sitter
                ? t("hamburger_menu.sitter_profile")
                : t("hamburger_menu.become_sitter")}
            </Link>
            {userInfo?.is_sitter && (
              <Link
                to="/dashboard/requests"
                className="text-white block text-lg pb-4 border-b border-white"
                onClick={toggleMobileMenu}
              >
                {t("hamburger_menu.requests")}
              </Link>
            )}

            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="text-white block text-lg pt-2 border-white border-t w-full hover:underline"
            >
              {t("hamburger_menu.logout")}
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
