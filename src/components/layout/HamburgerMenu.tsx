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
    // <div
    //   ref={menuRef}
    //   //   onClick={(e) => e.stopPropagation()}
    //   className="bg-white border border-transparent rounded w-32 absolute top-12 shadow-custom z-50"
    // >
    //   <ul className="list-none p-0 m-0">
    //     <li>
    //       <Link to="/dashboard/account" onClick={onClose}>
    //         <div className="px-4 py-2 border-b  border-slate-300 hover:bg-zinc-100 text-sm">
    //           {t("hamburger_menu.account")}
    //         </div>
    //       </Link>
    //     </li>
    //     <li>
    //       <Link to="/dashboard/sitter_profile" onClick={onClose}>
    //         <div className="px-4 py-2 border-b  border-slate-300 hover:bg-zinc-100 text-sm">
    //           {t("hamburger_menu.profile")}
    //         </div>
    //       </Link>
    //     </li>
    //     <li>
    //       <Link to="/dashboard/bookings" onClick={onClose}>
    //         <div className="px-4 py-2 border-b  border-slate-300 hover:bg-zinc-100 text-sm">
    //           {t("hamburger_menu.bookings")}
    //         </div>
    //       </Link>
    //     </li>
    //     <li
    //       className="px-4 py-2 border-slate-300 hover:bg-zinc-100 text-sm cursor-pointer"
    //       onClick={() => {
    //         onClose();
    //         handleLogout();
    //       }}
    //     >
    //       {t("hamburger_menu.logout")}
    //     </li>
    //   </ul>
    // </div>
    <div>
      <Link
        to="/dashboard/account"
        className="text-white block"
        // onClick={toggleMobileMenu}
      >
        {t("hamburger_menu.account")}
      </Link>
      <Link
        to="/dashboard/bookings"
        className="text-white block"
        // onClick={toggleMobileMenu}
      >
        {t("hamburger_menu.bookings")}
      </Link>
      <Link
        to="/dashboard/sitter_profile"
        className="text-white block"
        // onClick={toggleMobileMenu}
      >
        {t("hamburger_menu.become_sitter")}
      </Link>
      <Link
        to="/dashboard/requests"
        className="text-white block"
        // onClick={toggleMobileMenu}
      >
        {t("hamburger_menu.requests")}
      </Link>

      <button
        onClick={() => {
          handleLogout();
          // setMobileMenuOpen(false);
        }}
        className="text-white block hover:underline"
      >
        {t("hamburger_menu.logout")}
      </button>
    </div>
  );
};

export default HamburgerMenu;
