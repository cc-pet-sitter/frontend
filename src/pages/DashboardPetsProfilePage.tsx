import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;
import EditPetProfileForm from "../components/profile/EditPetProfileForm";
import PetProfile from "../components/profile/PetProfile";
import { PetProfileData } from "../types/userProfile";
import axiosInstance from "../api/axiosInstance";

const DashboardPetsProfilePage: React.FC = () => {
  const [petProfiles, setPetProfiles] = useState<Array<PetProfileData> | null>(
    null
  );
  const [selectedPetProfile, setSelectedPetProfile] =
    useState<PetProfileData | null>(null);
  const { t } = useTranslation();
  const { userInfo } = useAuth();
  const [showEditProfileForm, setShowEditProfileForm] =
    useState<boolean>(false);
  const [showProfileView, setShowProfileView] = useState<boolean>(false);

  const fetchPetProfiles = async () => {
    try {
      const response = await axiosInstance.get(
        `${apiURL}/appuser/${userInfo?.id}/pet`
      );
      setPetProfiles(response.data);
    } catch (error) {
      console.error("Unable to fetch pet profiles", error);
    }
  };

  useEffect(() => {
    fetchPetProfiles();
  }, []);

  return (
    <div className="dashboard-container">
      {showEditProfileForm ? (
        <div className="">
          <EditPetProfileForm
            petProfile={selectedPetProfile}
            onClose={() => {
              setSelectedPetProfile(null);
              setShowEditProfileForm(false);
              fetchPetProfiles();
            }}
          />
        </div>
      ) : showProfileView ? (
        <div className="">
          <PetProfile
            petProfile={selectedPetProfile}
            onClose={() => {
              setSelectedPetProfile(null);
              setShowProfileView(false);
              fetchPetProfiles();
            }}
          />
        </div>
      ) : (
        <div className="my-6">
          {petProfiles?.length !== 0 ? (
            <>
              <h1 className="mx-6 mb-2 font-bold text-2xl">
                {t("dashboard_pets_profile_page.title")}
              </h1>

              <div className="flex flex-col">
                {petProfiles?.map((profile, index) => (
                  <div
                    key={index}
                    className="mx-6 my-3 border border-transparent shadow-custom rounded w-80 sm:w-100 p-4"
                  >
                    <div className="sm:mt-0 sm:ml-6 flex items-center justify-between gap-4">
                      <img
                        src={
                          profile.profile_picture_src ||
                          "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/640px-Cat03.jpg"
                        }
                        alt={`Picture of ${profile.name}`}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                      <div>
                        <h2 className="font-medium my-1 text-lg">
                          {profile.name}
                        </h2>

                        <div>
                          <button
                            onClick={() => {
                              setSelectedPetProfile(profile);
                              setShowEditProfileForm(true);
                            }}
                            className="text-brown text-sm underline mr-4 "
                          >
                            <a>
                              {t("dashboard_pets_profile_page.edit_button")}
                            </a>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPetProfile(profile);
                              setShowProfileView(true);
                            }}
                            className="text-brown text-sm underline mr-4"
                          >
                            <a>
                              {t("dashboard_pets_profile_page.view_button")}
                            </a>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowEditProfileForm(true)}
                  className="mx-6 my-4 btn-secondary py-1 px-2 rounded w-36 text-sm"
                >
                  {t("dashboard_pets_profile_page.add_profile")}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center h-screen text-center">
                <h1 className="mb-2 font-bold text-2xl">
                  {t("dashboard_pets_profile_page.title")}
                </h1>

                <p className="mb-4">
                  {t("dashboard_pets_profile_page.subtitle")}
                </p>
                <button
                  onClick={() => setShowEditProfileForm(true)}
                  className="shadow btn-primary focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded"
                >
                  {t("dashboard_pets_profile_page.first_profile")}
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPetsProfilePage;
