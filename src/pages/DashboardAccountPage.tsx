import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import EditSitterProfileForm from "../components/profile/EditSitterProfileForm";
import SignUpForm from "../components/profile/SignUpForm";
import EditProfileForm from "../components/profile/EditProfileForm";

const DashboardAccountPage: React.FC = () => {
  const { userInfo } = useAuth();
  const { t } = useTranslation();

  const [showSignUpForm, setShowSignUpForm] = useState<boolean>(false);

  return (
    <div className="dashboard-container">
      <h2 className="text-center items-center mx-6 mb-2 pt-6 font-bold text-3xl">
        {t("dashboard_account_page.title")}
      </h2>

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
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center p-6">
                <img
                  // src={user.profile_picture_src}
                  // alt={`${user.firstname} ${user.lastname}`}
                  className="h-48 w-48 rounded-full object-cover"
                />
                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{`${userInfo.firstname} ${userInfo.lastname}`}</h1>
                  <p className="text-gray-500">{userInfo.email}</p>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 border-t">
                <h2 className="text-lg font-semibold mb-4">Profile Details</h2>
                <ul className="list-none space-y-2 text-left">
                  <li>
                    <strong>Location:</strong>{" "}
                    {/* {`${user.prefecture}, ${user.city_ward}`} */}
                  </li>
                  <li>
                    <strong>Address:</strong>
                    {/* {user.street_address} */}
                  </li>
                  <li>
                    <strong>Postal Code:</strong>
                    {/* {user.postal_code} */}
                  </li>
                  <li>
                    <strong>Languages:</strong>{" "}
                    {/* {user.english_ok && user.japanese_ok
                  ? "English, Japanese"
                  : user.english_ok
                  ? "English"
                  : "Japanese"} */}
                  </li>
                  <li>
                    <strong>Account Language:</strong>
                    {/* {user.account_language} */}
                  </li>
                </ul>
              </div>

              {/* Timestamps */}
              <div className="p-6 border-t">
                <h2 className="text-lg font-semibold mb-4">
                  Account Information
                </h2>
                <ul className="list-none space-y-2 text-left">
                  <li>
                    <strong>Account Created:</strong>{" "}
                    {/* {new Date(user.account_created).toLocaleString()} */}
                  </li>
                  <li>
                    <strong>Last Login:</strong>{" "}
                    {/* {new Date(user.last_login).toLocaleString()} */}
                  </li>
                  <li>
                    <strong>Last Updated:</strong>{" "}
                    {/* {new Date(user.last_updated).toLocaleString()} */}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="flex justify-center pb-8 ">
            <button
              onClick={() => setShowSignUpForm(true)}
              className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
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
