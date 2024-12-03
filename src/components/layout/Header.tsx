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
  const { t, i18n } = useTranslation();

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [alignment, setAlignment] = React.useState(i18n.resolvedLanguage);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const { currentUser } = useAuth();
  const { userInfo } = useAuth();

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
    event.preventDefault();
    if (newAlignment) {
      setAlignment(newAlignment);
      i18n.changeLanguage(newAlignment);
    }
  };

  useEffect(() => {
    setAlignment(i18n.resolvedLanguage); // Sync alignment with i18n on mount
  }, [i18n.resolvedLanguage]);

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
    <header className="bg-white border border-b">
      <nav className="flex items-center justify-between h-12 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div
          className="text-brown
         text-xl font-bold"
        >
          <Link to="/">むぎ （Mugi）</Link>
        </div>
        <div className="flex space-x-8">
          {/* <div className="flex space-x-1"> */}
          <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleButtonChange}
            aria-label="Language Selection"
          >
            {Object.keys(lngs).map((lng) => (
              <ToggleButton
                key={lng}
                value={lng}
                type="button"
                disableRipple
                disableFocusRipple
                disableTouchRipple
                disabled={i18n.resolvedLanguage === lng}
                // className="focus:outline-none"
                sx={{
                  border: "1px solid #d87607",
                  borderRadius: "6px",
                  padding: "4px 6px",
                  fontSize: "10px",

                  color: alignment === lng ? "#ffffff" : "#d87607",
                  backgroundColor: alignment === lng ? "#d87607" : "#ffffff",
                  "&.Mui-selected": {
                    backgroundColor: "#d87607",
                    color: "#ffffff",
                    borderColor: "#d87607",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: "#d87607",
                    color: "#ffffff",
                  },
                }}
              >
                {lngs[lng].nativeName}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          {/* </div> */}
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            {!currentUser ? (
              <>
                <Link to="/login" className="text-brown">
                  {t("header.login")}
                </Link>
                <Link to="/signup" className="text-brown">
                  {t("header.signup")}
                </Link>
              </>
            ) : (
              <>
                <div className="relative">
                  <span
                    ref={triggerRef}
                    onClick={() => setMenuOpen((prev) => !prev)}
                    className="cursor-pointer btn-secondary"
                  >
                    {userInfo?.firstname}
                  </span>
                  {menuOpen && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg z-50 p-4 space-y-2 justify-center"
                    >
                      <Link
                        to="/dashboard/account"
                        className="block px-4 hover:bg-gray-200 text-lg border-gray "
                        onClick={toggleMenu}
                      >
                        {t("hamburger_menu.account")}
                      </Link>
                      <Link
                        to="/dashboard/pets_profile"
                        className="block px-4 hover:bg-gray-200 text-lg py-2 border-gray "
                        onClick={toggleMenu}
                      >
                        {t("hamburger_menu.pets_profile")}
                      </Link>
                      <Link
                        to="/dashboard/bookings"
                        className="block px-4 hover:bg-gray-200 text-lg pb-4 border-b border-gray "
                        onClick={toggleMenu}
                      >
                        {t("hamburger_menu.bookings")}
                      </Link>
                      <Link
                        to="/dashboard/sitter_profile"
                        className="block px-4 hover:bg-gray-200 text-lg pb-2 pt-2 border-gray"
                        onClick={toggleMenu}
                      >
                        {userInfo?.is_sitter
                          ? t("hamburger_menu.sitter_profile")
                          : t("hamburger_menu.become_sitter")}
                      </Link>
                      {userInfo?.is_sitter && (
                        <Link
                          to="/dashboard/requests"
                          className="block px-4 hover:bg-gray-200 text-lg pb-2 border-gray"
                          onClick={toggleMenu}
                        >
                          {t("hamburger_menu.requests")}
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          handleLogout();
                          toggleMenu();
                        }}
                        className="w-full text-left px-4 pb-2 hover:bg-gray-200 text-lg pt-4 border-t flex"
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
              className="text-brown focus:outline-none"
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
        }  md:hidden bg-white px-7 py-4 space-y-2 w-full justify-center z-50`}
      >
        {!currentUser ? (
          <div>
            <Link
              to="/login"
              className="text-brown block text-lg py-2 "
              onClick={toggleMobileMenu}
            >
              {t("header.login")}
            </Link>
            <Link
              to="/signup"
              className="text-brown block text-lg py-2 "
              onClick={toggleMobileMenu}
            >
              {t("header.signup")}
            </Link>
          </div>
        ) : (
          <>
            <Link
              to="/dashboard/account"
              className=" block text-lg pb-2 "
              onClick={toggleMobileMenu}
            >
              {t("hamburger_menu.account")}
            </Link>
            <Link
              to="/dashboard/pets_profile"
              className=" block text-lg pb-2 "
              onClick={toggleMobileMenu}
            >
              {t("hamburger_menu.pets_profile")}
            </Link>
            <Link
              to="/dashboard/bookings"
              className=" block text-lg pb-4 border-b "
              onClick={toggleMobileMenu}
            >
              {t("hamburger_menu.bookings")}
            </Link>
            <Link
              to="/dashboard/sitter_profile"
              className="block text-lg pb-2 pt-2 "
              onClick={toggleMobileMenu}
            >
              {userInfo?.is_sitter
                ? t("hamburger_menu.sitter_profile")
                : t("hamburger_menu.become_sitter")}
            </Link>
            {userInfo?.is_sitter && (
              <Link
                to="/dashboard/requests"
                className="block text-lg pb-2 "
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
              className="text-lg pt-4 pb-2  border-t w-full hover:underline flex "
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
