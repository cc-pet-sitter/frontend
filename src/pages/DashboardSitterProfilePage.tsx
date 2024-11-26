import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;
import TokenDisplay from "../components/auth/TokenDisplay";
import EditSitterProfileForm from "../components/profile/EditSitterProfileForm";
import SignUpForm from "../components/profile/SignUpForm";

const DashboardSitterProfilePage: React.FC = () => {
  const [sitterProfile, setSitterProfile] = useState(null);
  const { t } = useTranslation();
  const { userInfo } = useAuth();
  const [showEditProfileForm, setShowEditProfileForm] =
    useState<boolean>(false);

  const fetchSitterProfile = async () => {
    if (userInfo?.is_sitter) {
      try {
        const response = await axios.get(
          `${apiURL}/sitter/${userInfo?.user_id}`
        );
        console.log(response.data);
        setSitterProfile(response.data);
      } catch (error) {
        console.error("Unable to fetch sitter profile", error);
      }
    }
  };

  useEffect(() => {
    fetchSitterProfile();
  }, []);

  const handleSave = (updatedProfile) => {
    setSitterProfile(updatedProfile);
    setShowEditProfileForm(false); // Exit editing mode after saving
  };

  return (
    <div className="dashboard-container p-4">
      {showEditProfileForm ? (
        <div className="mt-6">
          <EditSitterProfileForm
            sitterProfile={sitterProfile}
            closeEditProfileForm={() => setShowEditProfileForm(false)}
            onSave={handleSave}
          />
        </div>
      ) : sitterProfile ? (
        <div>
          <h2 className="mx-6 mb-2 font-bold text-2xl">
            {t("dashboard_Sitter_Profile_page.title")}
          </h2>
          <div className="flex justify-center px-4 sm:px-6 lg:px-8">
            <ul className="w-full max-w-4xl">
              <div className="pb-6">
                <div className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm sm:flex-row sm:gap-6">
                  <nav className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:p-6">
                    {/* Image */}
                    <div className="mr-0 mb-4 grid place-items-center sm:mr-6 sm:mb-0">
                      {/* <img
                    alt="Petter Sitter Image"
                    src={ele.sitter_profile.bio_picture_src_list}
                    className="h-32 w-32 rounded-full object-cover object-center sm:h-32 sm:w-32"
                  /> */}
                    </div>
                    {/* Content */}
                    <div>
                      <h6 className="text-slate-800 font-medium text-base sm:text-lg">
                        {"ele.sitter_profile.profile_bio"}
                      </h6>
                      <p className="text-slate-500 text-sm sm:text-base">
                        {/* {ele.sitter_profile.visit_ok
                      ? t("searchPage.available")
                      : t("searchPage.notAvailable")} */}
                      </p>
                      <div className="pt-4 pb-4">
                        <p className="text-slate-500 text-sm">
                          {/* {ele.sitter_profile.dogs_ok ? "✅ Dogs" : "❌ Dogs"} */}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {/* {ele.sitter_profile.cats_ok ? "✅ Cats" : "❌ Cats"} */}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {/* {ele.sitter_profile.fish_ok ? "✅ Fish" : "❌ Fish"} */}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {/* {ele.sitter_profile.birds_ok ? "✅ Birds" : "❌ Birds"} */}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {/* {ele.sitter_profile.rabbits_ok
                        ? "✅ Rabbits"
                        : "❌ Rabbits"} */}
                        </p>
                      </div>
                      <div></div>
                    </div>
                  </nav>
                </div>
              </div>
            </ul>
          </div>

          <button
            onClick={() => setShowEditProfileForm(true)}
            className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          >
            {t("dashboard_Sitter_Profile_page.edit_button")}
          </button>
        </div>
      ) : (
        <>
          <h1>Become a Sitter</h1>
          <p>Create your sitter profile to start offering services.</p>
          <button onClick={() => setShowEditProfileForm(true)}>
            Create Profile
          </button>
        </>
      )}
    </div>
  );
};

export default DashboardSitterProfilePage;
