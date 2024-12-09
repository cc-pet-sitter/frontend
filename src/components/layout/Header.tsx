import React, { useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { useTranslation } from "react-i18next";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import logoImage from "../../Images/mugi-logo-transparent.png";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
} from "@material-tailwind/react";

const lngs: Record<string, { nativeName: string }> = {
  en: { nativeName: "English" },
  ja: { nativeName: "日本語" },
};

const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const { userInfo } = useAuth();

  const [alignment, setAlignment] = React.useState(i18n.resolvedLanguage);
  const [openRight, setOpenRight] = React.useState(false);

  const triggerRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();

  const openDrawerRight = () => setOpenRight(true);
  const closeDrawerRight = () => setOpenRight(false);

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

  return (
    <header className="fixed top-0 left-0 w-full bg-white border border-b z-[102] h-12">
      <nav className="flex items-center justify-between h-12 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div
          className="text-brown
         text-xl font-bold"
        >
          <Link to="/">
            <img src={logoImage} alt="Cute pets" className="h-9 w-18" />
          </Link>
        </div>
        <div className="flex space-x-8">
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

          <div className="hidden md:flex space-x-6 items-center">
            {!currentUser ? (
              <>
                <Link to="/login" className="text-brown">
                  {t("header.login")}
                </Link>
                <span
                  ref={triggerRef}
                  // onClick={() => setMenuOpen((prev) => !prev)}
                  className="cursor-pointer btn-secondary w-auto px-2 py-1 font-normal"
                >
                  <Link to="/signup" className="text-white">
                    {t("header.signup")}
                  </Link>
                </span>
              </>
            ) : (
              <>
                <div className="relative">
                  <Menu>
                    <MenuHandler>
                      <Button className="normal-case cursor-pointer btn-secondary bg-#D87607 px-auto py-2">
                        {userInfo?.firstname}
                      </Button>
                    </MenuHandler>
                    <MenuList>
                      <Link to="/dashboard/account">
                        <MenuItem>{t("hamburger_menu.account")}</MenuItem>
                      </Link>
                      <Link to="/dashboard/pets_profile">
                        <MenuItem>{t("hamburger_menu.pets_profile")}</MenuItem>
                      </Link>
                      <Link to="/dashboard/bookings">
                        <MenuItem>{t("hamburger_menu.bookings")}</MenuItem>
                      </Link>
                      <hr className="my-3" />
                      <Link to="/dashboard/sitter_profile">
                        <MenuItem>
                          {userInfo?.is_sitter
                            ? t("hamburger_menu.sitter_profile")
                            : t("hamburger_menu.become_sitter")}
                        </MenuItem>
                      </Link>
                      {userInfo?.is_sitter && (
                        <Link to="/dashboard/requests">
                          <MenuItem>{t("hamburger_menu.requests")}</MenuItem>
                        </Link>
                      )}
                      <hr className="my-3" />
                      <MenuItem>
                        <div
                          onClick={() => {
                            handleLogout();
                          }}
                        >
                          {t("hamburger_menu.logout")}
                        </div>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </div>
              </>
            )}
          </div>

          {/* Mobile Hamburger Icon */}
          <div className="ms:hidden md:hidden flex items-center">
            <div className="relative h-full w-full">
              <React.Fragment>
                <button
                  onClick={openDrawerRight}
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
                <Drawer
                  placement="right"
                  open={openRight}
                  onClose={closeDrawerRight}
                  className="p-4 w-full fixed top-0 right-0 h-full "
                >
                  <div className="flex items-center justify-between ">
                    <div></div>

                    <IconButton
                      variant="text"
                      color="blue-gray"
                      onClick={closeDrawerRight}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </IconButton>
                  </div>
                  <List>
                    {!currentUser ? (
                      <>
                        <Link
                          to="/login"
                          className="text-brown text-lg ml-2"
                          onClick={closeDrawerRight}
                        >
                          <ListItem>{t("header.login")}</ListItem>
                        </Link>
                        <Link
                          to="/signup"
                          className="text-white"
                          onClick={closeDrawerRight}
                        >
                          <ListItem>
                            <span className="cursor-pointer btn-secondary w-auto px-2 py-1 font-normal">
                              {t("header.signup")}
                            </span>
                          </ListItem>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/dashboard/account"
                          onClick={closeDrawerRight}
                        >
                          <ListItem>{t("hamburger_menu.account")}</ListItem>
                        </Link>
                        <Link
                          to="/dashboard/pets_profile"
                          onClick={closeDrawerRight}
                        >
                          <ListItem>
                            {t("hamburger_menu.pets_profile")}
                          </ListItem>
                        </Link>
                        <Link
                          to="/dashboard/bookings"
                          onClick={closeDrawerRight}
                        >
                          <ListItem>{t("hamburger_menu.bookings")}</ListItem>
                        </Link>
                        <hr className="my-3" />
                        <Link
                          to="/dashboard/sitter_profile"
                          onClick={closeDrawerRight}
                        >
                          <ListItem>
                            {userInfo?.is_sitter
                              ? t("hamburger_menu.sitter_profile")
                              : t("hamburger_menu.become_sitter")}
                          </ListItem>
                        </Link>
                        {userInfo?.is_sitter && (
                          <Link
                            to="/dashboard/requests"
                            onClick={closeDrawerRight}
                          >
                            <ListItem>{t("hamburger_menu.requests")}</ListItem>
                          </Link>
                        )}
                        <hr className="my-3" />
                        <div
                          onClick={() => {
                            handleLogout();
                            closeDrawerRight();
                          }}
                        >
                          <ListItem>{t("hamburger_menu.logout")}</ListItem>
                        </div>
                      </>
                    )}
                  </List>
                </Drawer>
              </React.Fragment>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
