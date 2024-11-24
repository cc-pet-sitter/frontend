import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useTranslation, Trans } from "react-i18next";
import HamburgerMenu from "./HamburgerMenu";

const lngs = {
  en: { nativeName: "English" },
  ja: { nativeName: "Japanese" },
};

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<Boolean>(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const { t, i18n } = useTranslation();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLDivElement | null>(null);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("login");
    } catch (err) {
      console.error("Failed to logout: ", err);
    }
  };

  const toggleMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  useState(() => {
    console.log(menuOpen);
  });

  return (
    <header className="h-12 bg-green-500 content-center">
      <nav>
        <div className="flex flex-row ">
          <div className="basis-3/4 px-20">
            <Link to="/">Pet Sitter </Link>
          </div>
          {/* <div className="basis-1/3">
            <Link to="/sitter_profile_page">Profile </Link>
          </div> */}
          {/* <div className="basis-1/4">
            <Link to="/search_page">Search </Link>
          </div> */}

          <div className="flex flex-row basis-1/4 ">
            <div className="basis-1/3">
              {currentUser ? (
                <div className="relative">
                  <span
                    className="cursor-pointer "
                    ref={triggerRef}
                    onClick={toggleMenu}
                  >
                    {currentUser?.email}
                    {/* will change to name */}
                  </span>
                  {menuOpen && (
                    <HamburgerMenu
                      menuRef={menuRef}
                      onClose={() => setMenuOpen(false)}
                      handleLogout={handleLogout}
                    ></HamburgerMenu>
                  )}
                </div>
              ) : (
                <>
                  <div className="basis-1/3">
                    <Link to="/login">{t("header.login")} </Link>
                  </div>
                  <div className="basis-1/3">
                    <Link to="/signup">{t("header.signup")}</Link>
                  </div>
                </>
              )}
            </div>
            {/* <div>
              {currentUser ? (
                <button onClick={handleLogout}>Logout</button>
              ) : (
                ""
              )}
              {currentUser ? <Link to="/dashboard">Dashboard </Link> : ""}
            </div> */}
          </div>
          <div>
            {Object.keys(lngs).map((lng) => (
              <button
                className="cursor-pointer"
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
      </nav>
    </header>
  );
};

export default Header;
