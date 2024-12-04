import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

import { useTranslation } from "react-i18next";
import EditProfileForm from "../components/profile/EditProfileForm";
import ProfilePictureUploader from "../components/services/ProfilePictureUploader";

const DashboardAccountPage: React.FC = () => {
  const { currentUser, userInfo, setUserInfo } = useAuth();
  const { t } = useTranslation();

  const [showSignUpForm, setShowSignUpForm] = useState<boolean>(false);

  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const handleUpload = async (url: string) => {
    setProfilePicture(url);

    const idToken = await currentUser?.getIdToken();
    const backendURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
    const response = await fetch(`${backendURL}/appuser/${userInfo?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        id: userInfo?.id,
        profile_picture_src: url,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || "Failed to save user profile picture.");
    }

    const updatedUser = await response.json();
    setUserInfo(updatedUser);
  };

  return (
    <div className="dashboard-container">
      {/* <div>
        <div>
          <p>First name</p>
          <p>{"firstname"}</p>
        </div>
        <div>
          <p>Last name</p>
          <p>{"lastname"}</p>
        </div>
        <div>
          <p>Email address</p>
          <p>{"email"}</p>
        </div>
        <div>
          <p>Address</p>
          <p>{"poatal_code, prefecture, city_ward, street_address"}</p>
        </div>
        <div>
          <p>Languages</p>
          <p>{"english, japanese"}</p>
        </div>
      </div> */}
      {!showSignUpForm && (
        <div>
          <div className="container mx-auto p-6">
            <h2 className="text-center items-center mx-6 mb-2 pt-6 font-bold text-3xl">
              {t("dashboard_account_page.title")}
            </h2>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center p-6">
                <img
                  src={
                    userInfo?.profile_picture_src ||
                    profilePicture ||
                    "https://firebasestorage.googleapis.com/v0/b/petsitter-84e85.firebasestorage.app/o/user_profile_pictures%2Fdefault-profile.svg?alt=media&token=aa84dc5e-41e5-4f6a-b966-6a1953b25971"
                  }
                  alt={`${userInfo?.firstname} ${userInfo?.lastname}`}
                  className="h-48 w-48 rounded-full object-cover"
                />
                <ProfilePictureUploader
                  id={userInfo?.id}
                  pictureType="user_profile_pictures"
                  onUpload={handleUpload}
                  existingPictureUrl={userInfo?.profile_picture_src || ""}
                />
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
                      <strong>{`${t("sitterProfilePage.location")}: `}</strong>
                      {userInfo?.prefecture}, {userInfo?.city_ward}
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>{`${t("sitterProfilePage.address")}: `}</strong>
                      {userInfo?.street_address}
                    </div>
                  </li>
                  <li>
                    <div>
                      <strong>{`${t("sitterProfilePage.postCode")}: `}</strong>
                      {userInfo?.postal_code}
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
                  {/* <li>
                    <div>
                      <strong>{`${t("sitterProfilePage.languages")}: `}</strong>
                      {userInfo?.account_language}
                    </div>
                  </li> */}
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
