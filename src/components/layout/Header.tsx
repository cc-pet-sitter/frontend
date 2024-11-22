import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useTranslation, Trans } from "react-i18next";

const lngs = {
  en: { nativeName: "English" },
  ja: { nativeName: "Japanese" },
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

  return (
    <header className="h-20 bg-green-500 content-center">
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
              <Link to="/login">Login </Link>
            </div>
            <div className="basis-1/3">
              <Link to="/signup">Sign Up </Link>
            </div>
            <div className="basis-1/3">
              {currentUser ? (
                <p>Welcome, {currentUser?.email}!</p>
              ) : (
                <p>Just Visiting</p>
              )}
            </div>
            <div>
              {currentUser ? (
                <button onClick={handleLogout}>Logout</button>
              ) : (
                ""
              )}
              {currentUser ? <Link to="/dashboard">Dashboard </Link> : ""}
            </div>
          </div>
          <div>
            {Object.keys(lngs).map((lng) => (
              <button
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
