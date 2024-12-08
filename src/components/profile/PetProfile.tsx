import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { PiDog, PiCat, PiMedal, PiRabbit, PiBird } from "react-icons/pi";
import { LiaBirthdayCakeSolid, LiaWeightSolid } from "react-icons/lia";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { LuDog, LuFish } from "react-icons/lu";
import { PetProfileData } from "../../types/userProfile";
import FeaturedImageGallery from "./FeaturedImageGallery";
import { TailSpin } from "react-loader-spinner";

type Props = {
  petProfile: PetProfileData | null;
  onClose: () => void;
};

const PetProfile: React.FC<Props> = ({ petProfile, onClose }) => {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!petProfile?.profile_picture_src) {
      setImageLoaded(true);
    }
  }, [petProfile]);

  return (
    <div>
      <button
        onClick={(e) => {
          e.preventDefault();
          onClose();
        }}
        className="m-6 flex"
      >
        <MdOutlineArrowBackIos className="mr-3 mt-1" />{" "}
        <p>{t("request_details_page.goBack")}</p>
      </button>

      {petProfile && (
        <div className="container mx-autos">
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center my-6">
              {!imageLoaded && (
                <div className="flex items-center justify-center bg-gray-300 h-48 w-48 rounded-full ">
                  <TailSpin
                    height="50"
                    width="50"
                    color="#fabe25"
                    ariaLabel="loading"
                  />
                </div>
              )}

              {petProfile?.profile_picture_src ? (
                <img
                  src={petProfile.profile_picture_src}
                  alt={petProfile.name}
                  className={`h-48 w-48 rounded-full object-cover ${
                    imageLoaded ? "block" : "hidden"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
              ) : (
                <div className="flex items-center justify-center bg-gray-300 h-48 w-48 rounded-full ">
                  <PiDog className="h-40 w-40" color="white" />
                </div>
              )}
              <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                <h1 className="text-2xl font-bold">{petProfile.name}</h1>
              </div>
            </div>

            {/* Pet Details */}
            <div className="p-6 border-t">
              <h2 className="text-lg font-semibold mb-4">
                {t("PetProfile.about", { name: petProfile.name })}
              </h2>

              <div className="flex my-3 ">
                {petProfile.type_of_animal === "dog" && (
                  <>
                    <LuDog className="mr-3 mt-1 text-xl" />
                    {t("PetProfile.typeOfPet", {
                      animal: t("PetProfile.dog"),
                    })}
                  </>
                )}
                {petProfile.type_of_animal === "cat" && (
                  <>
                    <PiCat className="mr-3 mt-1 text-xl" />
                    {t("PetProfile.typeOfPet", {
                      animal: t("PetProfile.cat"),
                    })}
                  </>
                )}
                {petProfile.type_of_animal === "rabbit" && (
                  <>
                    <PiRabbit className="mr-3 mt-1 text-xl" />
                    {t("PetProfile.typeOfPet", {
                      animal: t("PetProfile.rabbit"),
                    })}
                  </>
                )}
                {petProfile.type_of_animal === "bird" && (
                  <>
                    <PiBird className="mr-3 mt-1 text-xl" />
                    {t("PetProfile.typeOfPet", {
                      animal: t("PetProfile.bird"),
                    })}
                  </>
                )}
                {petProfile.type_of_animal === "fish" && (
                  <>
                    <LuFish className="mr-3 mt-1 text-xl" />
                    {t("PetProfile.typeOfPet", {
                      animal: t("PetProfile.fish"),
                    })}
                  </>
                )}
              </div>

              {petProfile.birthday && <div className="flex my-3">
                <LiaBirthdayCakeSolid className="mr-3 mt-1 text-xl" />
                {t("PetProfile.birthday")}
                {new Date(petProfile.birthday).toLocaleDateString("ja-JP")}
              </div>}

              {petProfile.weight && (
                <div className="flex my-3">
                  <LiaWeightSolid className="mr-3 mt-1 text-xl" />
                  {t("PetProfile.weight", { weight: petProfile.weight })}
                </div>
              )}
              {petProfile.subtype && (
                <div className="flex my-3">
                  <PiMedal className="mr-3 mt-1 text-xl" />
                  {t("PetProfile.breed")}
                  {petProfile.subtype}
                </div>
              )}
            </div>

            {/* Care Info */}
            <div className="p-6 border-t">
              <h2 className="text-lg font-semibold mb-4">
                {t("sitterProfilePage.profileDetails")}
              </h2>
              <ul className="list-none space-y-2 text-left">
                <li>
                  <strong>{`${t("PetProfile.allergies")}:`}</strong>{" "}
                  {petProfile.known_allergies}
                </li>
                <li>
                  <strong>{`${t("PetProfile.medications")}:`}</strong>{" "}
                  {petProfile.medications}
                </li>
                <li>
                  <strong>{`${t("PetProfile.specialNeeds")}:`}</strong>{" "}
                  {petProfile.special_needs}
                </li>
                <li></li>
              </ul>
            </div>

            {/* Additional Images */}
            {petProfile.pet_bio_picture_src_list && (
              <div className="p-6 border-t">
                <h2 className="text-lg font-semibold mb-4">
                  {t("sitterProfilePage.additionalImages")}
                </h2>
                <FeaturedImageGallery
                  picture_src_list={petProfile.pet_bio_picture_src_list || ""}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetProfile;
