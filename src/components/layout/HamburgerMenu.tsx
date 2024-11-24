import React, { MutableRefObject } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

type Props = {
  onClose: () => void;
  handleLogout: () => void;
  menuRef: MutableRefObject<HTMLDivElement | null>;
};

const HamburgerMenu: React.FC<Props> = ({ menuRef, onClose, handleLogout }) => {
  const { t } = useTranslation();

  return (
    <div
      ref={menuRef}
      //   onClick={(e) => e.stopPropagation()}
      className="bg-white border border-transparent rounded w-32 absolute top-12 shadow-lg z-50"
    >
      <ul className="list-none p-0 m-0">
        <li className="p-4 border-b  border-slate-300">
          <Link to="/dashboard/account" onClick={onClose}>
            {t("hamburger_menu.account")}
          </Link>
        </li>
        <li className="p-4 border-b border-slate-300">
          <Link to="/dashboard/sitter_profile" onClick={onClose}>
            {t("hamburger_menu.profile")}
          </Link>
        </li>
        <li className="p-4 border-b border-slate-300">
          <Link to="/dashboard/bookings" onClick={onClose}>
            {t("hamburger_menu.bookings")}
          </Link>
        </li>
        <li
          className="p-4 cursor-pointer"
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
