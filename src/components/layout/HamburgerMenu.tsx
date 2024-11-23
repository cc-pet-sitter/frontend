import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Props = {
  onClose: () => void;
  handleLogout: () => void;
};

const HamburgerMenu: React.FC<Props> = ({ onClose, handleLogout }) => {
  const { t } = useTranslation();

  return (
    <div>
      <ul>
        <li>
          <Link to="/user/profile" onClick={onClose}>
            {t("hamburger_menu.profile")}
          </Link>
        </li>
        <li>
          <Link to="/bookings/history" onClick={onClose}>
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
