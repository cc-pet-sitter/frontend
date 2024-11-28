import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;
import EditSitterProfileForm from "../components/profile/EditSitterProfileForm";

type SitterProfile = {
  sitter_profile_bio: string | null;
  visit_ok: boolean | null;
  sitter_house_ok: boolean | null;
  owner_house_ok: boolean | null;
  dogs_ok: boolean | null;
  cats_ok: boolean | null;
  fish_ok: boolean | null;
  birds_ok: boolean | null;
  rabbits_ok: boolean | null;
};

const DashboardSitterProfilePage: React.FC = () => {
  const [sitterProfile, setSitterProfile] = useState<SitterProfile | null>(
    null
  );
  const { t } = useTranslation();
  const { userInfo } = useAuth();
  const [showEditProfileForm, setShowEditProfileForm] =
    useState<boolean>(false);

  const fetchSitterProfile = async (is_sitter: boolean | null | undefined) => {
    if (is_sitter) {
      try {
        const response = await axios.get(
          `${apiURL}/sitter/${userInfo?.id}`
        );
        setSitterProfile(response.data);
      } catch (error) {
        console.error("Unable to fetch sitter profile", error);
      }
    }
  };

  useEffect(() => {
    fetchSitterProfile(userInfo?.is_sitter);
  }, []);

  const handleSave = (updatedProfile: SitterProfile) => {
    setSitterProfile(updatedProfile);
    setShowEditProfileForm(false);
  };

  return (
    <div className="dashboard-container p-4">
      {showEditProfileForm ? (
        <div className="mt-6">
          <EditSitterProfileForm
            fetchSitterProfile={fetchSitterProfile}
            sitterProfile={sitterProfile}
            closeEditForm={() => setShowEditProfileForm(false)}
            onSave={handleSave}
          />
        </div>
      ) : sitterProfile ? (
        <div>
          <h1 className="mx-6 mb-2 font-bold text-2xl">
            {t("dashboard_Sitter_Profile_page.title")}
          </h1>
          <div className="flex justify-center px-4 sm:px-6 lg:px-8">
            <ul className="w-full max-w-4xl">
              <div className="pb-6">
                <div className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm sm:flex-row sm:gap-6">
                  <nav className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:p-6">
                    {/* Image */}
                    <div className="mr-0 mb-4 grid place-items-center sm:mr-6 sm:mb-0">
                      <img
                        alt="Petter Sitter Image"
                        // src={sitterProfile.sitter_profile_bio}
                        src={
                          "https://live.staticflickr.com/62/207176169_60738224b6_c.jpg"
                        }
                        className="h-32 w-32 rounded-full object-cover object-center sm:h-32 sm:w-32"
                      />
                    </div>
                    {/* Content */}
                    <div>
                      <h6 className="text-slate-800 font-medium text-base sm:text-lg">
                        {sitterProfile.sitter_profile_bio}
                      </h6>
                      <p className="text-slate-500 text-sm sm:text-base">
                        {sitterProfile.visit_ok ||
                        sitterProfile.sitter_house_ok ||
                        sitterProfile.owner_house_ok
                          ? `${t("searchPage.available")} ${[
                              sitterProfile.sitter_house_ok &&
                                t("searchPage.sitter_house"),
                              sitterProfile.owner_house_ok &&
                                t("searchPage.owner_house"),
                              sitterProfile.visit_ok && t("searchPage.visits"),
                            ]
                              .filter(Boolean)
                              .join(", ")} `
                          : t("searchPage.notAvailable")}
                      </p>
                      <div className="pt-4 pb-4">
                        <p className="text-slate-500 text-sm">
                          {sitterProfile.dogs_ok ? "✅ Dogs" : "❌ Dogs"}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {sitterProfile.cats_ok ? "✅ Cats" : "❌ Cats"}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {sitterProfile.fish_ok ? "✅ Fish" : "❌ Fish"}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {sitterProfile.birds_ok ? "✅ Birds" : "❌ Birds"}
                        </p>
                        <p className="text-slate-500 text-sm">
                          {sitterProfile.rabbits_ok
                            ? "✅ Rabbits"
                            : "❌ Rabbits"}
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
            className="mx-4 shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-5 text-sm rounded"
          >
            {t("dashboard_Sitter_Profile_page.edit_button")}
          </button>
        </div>
      ) : (
        <>
          <h1 className="mx-6 mb-2 font-bold text-2xl">Become a Sitter</h1>
          <p className="mx-6">
            Create your sitter profile to start offering services.
          </p>
          <button
            onClick={() => setShowEditProfileForm(true)}
            className="m-6 shadow bg-green-500 hover:bg-green-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          >
            Create Profile
          </button>
        </>
      )}
    </div>
  );
};

export default DashboardSitterProfilePage;
