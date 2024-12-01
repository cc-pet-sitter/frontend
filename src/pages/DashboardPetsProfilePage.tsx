import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;
import EditPetProfileForm from "../components/profile/EditPetProfileForm";
import PetProfile from "../components/profile/PetProfile";

const petProfileTest = false;
const petProfileArrTest = [
  {
    profile_picture_src:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/640px-Cat03.jpg",
    name: "Mugi",
  },
  {
    profile_picture_src:
      "https://cdn.guidedogs.com.au/wp-content/uploads/2024/07/GD-Homepage-Manton-Mobile.jpg",
    name: "Pochi",
  },
  {
    profile_picture_src:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkox1ysqO7RXIWx5FVj2d79v-K44BRzxMN4A&s",
    name: "Mocha",
  },
];

type PetProfile = {
  id: Number;
  name: string;
  type_of_animal: string;
  subtype: string | null;
  weight: number | null;
  birthday: Date;
  known_allergies: string | null;
  medications: string | null;
  special_needs: string | null;
  appuser_id: number;
  profile_picture_src: string | undefined;
};

const DashboardPetsProfilePage: React.FC = () => {
  const [petProfiles, setPetProfiles] = useState<Array<PetProfile> | null>(
    null
  );
  const [selectedPetProfile, setSelectedPetProfile] =
    useState<PetProfile | null>(null);
  const { t } = useTranslation();
  const { userInfo } = useAuth();
  const [showEditProfileForm, setShowEditProfileForm] =
    useState<boolean>(false);
  const [showProfileView, setShowProfileView] = useState<boolean>(false);

  const fetchPetProfiles = async () => {
    try {
      const response = await axios.get(`${apiURL}/appuser/${userInfo?.id}/pet`);
      console.log("Fetched pet profiles:", response.data);
      setPetProfiles(response.data);
    } catch (error) {
      console.error("Unable to fetch pet profiles", error);
    }
  };

  useEffect(() => {
    fetchPetProfiles();
  }, []);

  // const handleSave = (updatedProfile: PetProfile) => {
  //   fetchPetProfiles(updatedProfile);
  //   setShowEditProfileForm(false);
  // };

  return (
    <div className="dashboard-container">
      {showEditProfileForm ? (
        <div className="">
          <EditPetProfileForm
            petProfile={selectedPetProfile}
            // fetchPetProfiles={fetchPetProfiles}
            // closeEditForm={() => setShowEditProfileForm(false)}
            onClose={() => {
              setSelectedPetProfile(null);
              setShowEditProfileForm(false);
              fetchPetProfiles();
            }}
            // onSave={handleSave}
          />
        </div>
      ) : showProfileView ? (
        <div className="">
          <PetProfile
            petProfile={selectedPetProfile}
            // fetchPetProfiles={fetchPetProfiles}
            // closeEditForm={() => setShowEditProfileForm(false)}
            onClose={() => {
              setSelectedPetProfile(null);
              setShowProfileView(false);
              fetchPetProfiles();
            }}
            // onSave={handleSave}
          />
        </div>
      ) : (
        <div>
          <h1 className="mx-6 mb-2 font-bold text-2xl">
            {t("dashboard_pets_profile_page.title")}
          </h1>

          {petProfiles?.length !== 0 ? (
            <>
              <div className="flex flex-col">
                {petProfiles?.map((profile, index) => (
                  <div
                    key={index}
                    className="mx-6 my-3 border border-transparent shadow-custom rounded w-80 sm:w-100 p-4"
                  >
                    <div className="sm:mt-0 sm:ml-6 flex items-center justify-between gap-4">
                      <img
                        // Hard coding the image URL for now
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/640px-Cat03.jpg"
                        // src={profile.profile_picture_src}
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
                            // className="mx-4 shadow btn-secondary focus:shadow-outline focus:outline-none text-white font-bold py-2 px-5 text-sm rounded"
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
                            // className="mx-4 shadow btn-secondary focus:shadow-outline focus:outline-none text-white font-bold py-2 px-5 text-sm rounded"
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
                  className="mx-6 my-4 btn-secondary py-1 px-2 rounded w-32 text-sm"
                >
                  {t("dashboard_pets_profile_page.add_profile")}
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="mx-6">
                {t("dashboard_pets_profile_page.subtitle")}
              </p>
              <button
                onClick={() => setShowEditProfileForm(true)}
                className="m-6 shadow btn-primary focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded"
              >
                {t("dashboard_pets_profile_page.first_profile")}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPetsProfilePage;
