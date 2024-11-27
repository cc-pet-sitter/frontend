import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import EditSitterProfileForm from "../components/profile/EditSitterProfileForm";
import EditProfileForm from "../components/profile/EditProfileForm";

const DashboardAccountPage: React.FC = () => {
  const { userInfo, loading } = useAuth();
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isCompletingProfile, setIsCompletingProfile] = useState<boolean>(false);

  // Determine if the user needs to complete their profile
  React.useEffect(() => {
    if (userInfo) {
      const isProfileIncomplete =
        !userInfo.prefecture ||
        !userInfo.city_ward ||
        !userInfo.street_address ||
        (!userInfo.english_ok && !userInfo.japanese_ok);
      setIsCompletingProfile(isProfileIncomplete);
    }
  }, [userInfo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{t("dashboard_account_page.loading")}</p>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{t("dashboard_account_page.userNotLoggedIn")}</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        {t("dashboard_account_page.title")}
      </h2>

      {/* Display Profile Information */}
      {!isEditing && !isCompletingProfile && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center p-6">
            {userInfo.profile_picture_src ? (
              <img
                src={userInfo.profile_picture_src}
                alt={`${userInfo.firstname} ${userInfo.lastname}`}
                className="h-48 w-48 rounded-full object-cover"
              />
            ) : (
              <div className="h-48 w-48 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                {userInfo.firstname[0]}{userInfo.lastname[0]}
              </div>
            )}
            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
              <h1 className="text-2xl font-bold">{`${userInfo.firstname} ${userInfo.lastname}`}</h1>
              <p className="text-gray-500">{userInfo.email}</p>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-auto">
              <button
                onClick={() => setIsEditing(true)}
                className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
              >
                {t("dashboard_account_page.edit_button")}
              </button>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-6 border-t">
            <h2 className="text-lg font-semibold mb-4">
              {t("dashboard_account_page.profileDetails")}
            </h2>
            <ul className="list-none space-y-2 text-left">
              <li>
                <strong>{t("dashboard_account_page.location")}:</strong>{" "}
                {`${userInfo.prefecture}, ${userInfo.city_ward}`}
              </li>
              <li>
                <strong>{t("dashboard_account_page.address")}:</strong>{" "}
                {userInfo.street_address}
              </li>
              <li>
                <strong>{t("dashboard_account_page.postalCode")}:</strong>{" "}
                {userInfo.postal_code}
              </li>
              <li>
                <strong>{t("dashboard_account_page.languages")}:</strong>{" "}
                {userInfo.english_ok && userInfo.japanese_ok
                  ? t("dashboard_account_page.englishJapanese")
                  : userInfo.english_ok
                  ? t("dashboard_account_page.english")
                  : t("dashboard_account_page.japanese")}
              </li>
              <li>
                <strong>{t("dashboard_account_page.accountLanguage")}:</strong>{" "}
                {userInfo.account_language}
              </li>
            </ul>
          </div>

          {/* Account Information */}
          <div className="p-6 border-t">
            <h2 className="text-lg font-semibold mb-4">
              {t("dashboard_account_page.accountInformation")}
            </h2>
            <ul className="list-none space-y-2 text-left">
              <li>
                <strong>{t("dashboard_account_page.accountCreated")}:</strong>{" "}
                {new Date(userInfo.account_created).toLocaleString()}
              </li>
              <li>
                <strong>{t("dashboard_account_page.lastLogin")}:</strong>{" "}
                {new Date(userInfo.last_login).toLocaleString()}
              </li>
              <li>
                <strong>{t("dashboard_account_page.lastUpdated")}:</strong>{" "}
                {new Date(userInfo.last_updated).toLocaleString()}
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Prompt to Complete Profile for New Users */}
      {isCompletingProfile && !isEditing && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">{t("dashboard_account_page.completeProfileTitle")}</p>
          <p>{t("dashboard_account_page.completeProfileMessage")}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          >
            {t("dashboard_account_page.completeProfileButton")}
          </button>
        </div>
      )}

      {/* Edit Profile Form */}
      {isEditing && (
        <div className="bg-white shadow-md rounded-lg overflow-hidden p-6">
          <EditProfileForm closeEditForm={() => setIsEditing(false)}/>
        </div>
      )}

      {/* Optionally, Edit Sitter Profile Form */}
      {/* Uncomment if applicable
      {userInfo.isSitter && (
        <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden p-6">
          <EditSitterProfileForm
            sitterInfo={userInfo.sitter_profile}
            onClose={() => setIsEditing(false)}
          />
        </div>
      )}
      */}

    </div>
  );
};

export default DashboardAccountPage;
