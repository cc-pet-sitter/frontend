import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

import { useTranslation } from "react-i18next";
import EditProfileForm from "../components/profile/EditProfileForm";
import { FaUserCircle } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";

const DashboardAccountPage: React.FC = () => {
  const [showSignUpForm, setShowSignUpForm] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const { userInfo } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (!userInfo?.profile_picture_src) {
      setImageLoaded(true);
    }
  }, [userInfo]);

  return (
    <div className="dashboard-container">
      {!showSignUpForm && (
        <div>
          <div className="container mx-auto p-6">
            <h2 className="text-center items-center mx-6 mb-2 pt-6 font-bold text-3xl">
              {t("dashboard_account_page.title")}
            </h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center p-6">
                <div className="relative h-48 w-48">
                  {/* Loader */}
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-full">
                      <TailSpin
                        height="50"
                        width="50"
                        color="#fabe25"
                        ariaLabel="loading"
                      />
                    </div>
                  )}
                  {/* Profile Picture */}
                  {userInfo?.profile_picture_src ? (
                    <img
                      src={userInfo?.profile_picture_src}
                      alt={`${userInfo?.firstname} ${userInfo?.lastname}`}
                      className={`h-48 w-48 rounded-full object-cover ${
                        imageLoaded ? "block" : "hidden"
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageLoaded(true)}
                    />
                  ) : (
                    <FaUserCircle className="h-48 w-48 text-gray-400" />
                  )}
                </div>
                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{`${userInfo?.firstname} ${userInfo?.lastname}`}</h1>
                  <p className="text-gray-500">{userInfo?.email}</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 border-t">
                <h2 className="text-lg font-semibold mb-4">
                  {t("sitterProfilePage.profileDetails")}
                </h2>
                <ul className="list-none space-y-2 text-left">
                  <li>
                    <div>
                      <strong>{`${t("sitterProfilePage.postCode")}: `}</strong>
                      {userInfo?.postal_code}
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>{`${t("sitterProfilePage.address")}: `}</strong>
                      {[
                        userInfo?.prefecture,
                        userInfo?.city_ward,
                        userInfo?.street_address,
                      ]
                        .filter(Boolean)
                        .join(",")}
                    </div>
                  </li>

                  <li>
                    <div>
                      <strong>{`${t("sitterProfilePage.languages")}: `}</strong>
                      {userInfo?.english_ok ? "English" : ""}
                      {userInfo?.english_ok && userInfo.japanese_ok ? ", " : ""}
                      {userInfo?.japanese_ok ? "Japanese" : ""}{" "}
                    </div>
                  </li>
                </ul>
              </div>

              {/* Timestamps */}
              <div className="p-6 border-t">
                <h2 className="text-lg font-semibold mb-4">
                  {t("sitterProfilePage.accountInformation")}
                </h2>
                <ul className="list-none space-y-2 text-left">
                  <li>
                    <div>
                      <strong>{`${t(
                        "dashboard_account_page.memberSince"
                      )}: `}</strong>
                      {userInfo?.account_created?.toLocaleString().slice(0, 10)}
                    </div>
                  </li>

                  <li>
                    <div>
                      <strong>{`${t(
                        "sitterProfilePage.lastUpdated"
                      )}: `}</strong>
                      {userInfo?.last_updated?.toLocaleString().slice(0, 10)}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-center pb-8 ">
            <button
              onClick={() => setShowSignUpForm(true)}
              className="shadow btn-secondary focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            >
              {t("dashboard_account_page.edit_button")}
            </button>
          </div>
        </div>
      )}

      {showSignUpForm && (
        <div className="mt-6">
          {/* <SignUpForm closeEditForm={() => setShowSignUpForm(false)} /> */}
          <EditProfileForm closeEditForm={() => setShowSignUpForm(false)} />
        </div>
      )}
    </div>
  );
};

export default DashboardAccountPage;
