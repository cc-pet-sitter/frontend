import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;
import EditPetProfileForm from "../components/profile/EditPetProfileForm";
import PetProfile from "../components/profile/PetProfile";
import { PetProfileData } from "../types/userProfile";
import axiosInstance from "../api/axiosInstance";
import { TailSpin } from "react-loader-spinner";
import { PiDog } from "react-icons/pi";

const DashboardPetsProfilePage: React.FC = () => {
  const [petProfiles, setPetProfiles] = useState<Array<PetProfileData> | null>(
    null
  );
  const [selectedPetProfile, setSelectedPetProfile] =
    useState<PetProfileData | null>(null);
  const [showEditProfileForm, setShowEditProfileForm] =
    useState<boolean>(false);
  const [showProfileView, setShowProfileView] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const { userInfo } = useAuth();
  const { t } = useTranslation();

  const fetchPetProfiles = async () => {
    try {
      const response = await axiosInstance.get(
        `${apiURL}/appuser/${userInfo?.id}/pet`
      );
      setPetProfiles(response.data);
    } catch (error) {
      console.error("Unable to fetch pet profiles", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPetProfiles();
  }, []);

  if (loading) {
    return <p>{t("dashboard_pets_profile_page.loading")}</p>;
  }

  return (
    <div className="dashboard-container md:m-14">
      {showEditProfileForm ? (
        // When clicking in "Edit profile"
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
        // When clicking in "View profile"
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
        // Display by deafult
        <div className="my-6">
          {petProfiles?.length !== 0 ? (
            // If there are several Pet Profiles display this block
            <div>
              <h1 className="mx-6 mb-2 font-bold text-2xl">
                {t("dashboard_pets_profile_page.title")}
              </h1>
              <div className="flex flex-col">
                <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-2 md:gap-y-4 md:justify-stretch">
                  {petProfiles?.map((profile, index) => (
                    <div
                      key={index}
                      className="mx-6 my-3 border border-transparent shadow-custom rounded w-80 sm:w-100 p-4"
                    >
                      <div className="sm:mt-0 sm:ml-6 flex items-center justify-between gap-4">
                        <div className="relative h-20 w-20">
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
                          {profile.profile_picture_src ? (
                            <img
                              src={profile.profile_picture_src}
                              alt={`Picture of ${profile.name}`}
                              className={`h-20 w-20 rounded-full object-cover ${
                                imageLoaded ? "block" : "hidden"
                              }`}
                              onLoad={() => setImageLoaded(true)}
                              onError={() => setImageLoaded(true)}
                            />
                          ) : (
                            <PiDog className="h-20 w-20 text-gray-400" />
                          )}
                        </div>

                        <div>
                          <h2 className="font-medium my-1 text-lg">
                            {profile.name}
                          </h2>
                          <div>
                            {/* Edit Profile */}
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
                            {/* View Profile */}
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
                </div>
                <button
                  onClick={() => setShowEditProfileForm(true)}
                  className="mx-6 my-4 btn-secondary py-1 px-2 rounded w-40 text-sm"
                >
                  {t("dashboard_pets_profile_page.add_profile")}
                </button>
              </div>
            </div>
          ) : (
            // If there is no registeres Pets display this block
            <div className="flex flex-col items-center justify-center h-screen text-center px-4">
              <h1 className="mx-6 mb-2 font-bold text-2xl">
                {t("dashboard_pets_profile_page.title")}
              </h1>
              <p className="mx-6">
                {t("dashboard_pets_profile_page.subtitle")}
              </p>
              <button
                onClick={() => setShowEditProfileForm(true)}
                className="m-6 shadow btn-primary focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded"
              >
                {t("dashboard_pets_profile_page.first_profile")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPetsProfilePage;
