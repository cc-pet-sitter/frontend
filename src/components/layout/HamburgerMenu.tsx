import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Props = {
  onClose: () => void;
  handleLogout: () => void;
};

const HamburgerMenu: React.FC<Props> = ({ onClose, handleLogout }) => {
  const { t } = useTranslation();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div ref={menuRef}>
      <ul>
        <li>
          <Link to="/dashboard/account" onClick={onClose}>
            {t("hamburger_menu.account")}
          </Link>
        </li>
        <li>
          <Link to="/dashboard/sitter_profile" onClick={onClose}>
            {t("hamburger_menu.profile")}
          </Link>
        </li>
        <li>
          <Link to="/dashboard/bookings" onClick={onClose}>
            {t("hamburger_menu.bookings")}
          </Link>
        </li>
        <li
          onClick={() => {
            onClose();
            handleLogout();
          }}
        >
          {t("hamburger_menu.logout")}
        </li>
      </ul>
    </div>
  );
};

export default HamburgerMenu;
