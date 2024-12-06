import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineArrowBackIos } from "react-icons/md";
import axiosInstance from "../../api/axiosInstance";
import { PetProfileData } from "../../types/userProfile.ts";
import ProfilePictureUploader from "../services/ProfilePictureUploader.tsx";
import MultiPictureUploder from "../services/MultiPictureUploader.tsx";
import ViewMultiPicture from "./ViewMultiPicture.tsx";

import { LuDog, LuFish } from "react-icons/lu";
import { PiBirdBold, PiCatBold, PiRabbitBold, PiDog  } from "react-icons/pi";

import { TailSpin } from "react-loader-spinner";
i


const apiURL: string = import.meta.env.VITE_API_BASE_URL;

type Props = {
  petProfile: PetProfileData | null;
  onClose: () => void;
};

const EditProfileForm: React.FC<Props> = ({ petProfile, onClose }) => {

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [petProfilePicture, setPetProfilePicture] = useState<string | undefined>(undefined);
  const [petBioPictureSrcList, setPetBioPictureSrcList] =
    useState<string>(petProfile?.pet_bio_picture_src_list || "");
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  
  const { register, handleSubmit, reset, getValues, setValue } = useForm<PetProfileData>({
    shouldUseNativeValidation: true,
  });
  const { userInfo } = useAuth();
  const { t } = useTranslation();

  // Pre-fill form if editing an existing pet profile
  useEffect(() => {
    if (petProfile) {
      reset({
        profile_picture_src: petProfile.profile_picture_src || "",
        name: petProfile.name || "",
        type_of_animal: petProfile.type_of_animal || "",
        subtype: petProfile.subtype || "",
        weight: petProfile.weight || null,
        birthday: petProfile.birthday || "",
        known_allergies: petProfile.known_allergies || "",
        medications: petProfile.medications || "",
        special_needs: petProfile.special_needs || "",
        pet_bio_picture_src_list: petProfile.pet_bio_picture_src_list || "",
      });
      setPetProfilePicture(petProfile.profile_picture_src || "");
      setPetBioPictureSrcList(petProfile.pet_bio_picture_src_list || "");
    }
  }, [petProfile, reset]);

  useEffect(() => {
    if (!petProfilePicture && !petProfile?.profile_picture_src) {
      setImageLoaded(true);
    }
  }, [petProfilePicture, petProfile]);

  const handleCreate = async (data: PetProfileData) => {
    console.log(data);
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(
        `${apiURL}/appuser/${userInfo?.id}/pet`,
        data
      );

      if (response.status === 201) {
        setSuccess(true);
        setError(null);
        onClose();
      } else {
        throw new Error(response.data.errors);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Error updating profile:", err.message);
      }
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: PetProfileData) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(
        `${apiURL}/pet/${petProfile?.id}`,
        {
          name: data.name,
          profile_picture_src: petProfilePicture,
          pet_bio_picture_src_list: petBioPictureSrcList,
          type_of_animal: data.type_of_animal,
          subtype: data.subtype,
          weight: data.weight,
          birthday: data.birthday,
          known_allergies: data.known_allergies,
          medications: data.medications,
          special_needs: data.special_needs,
        }
      );

      if (response.status === 200) {
        const updatedProfile = await response.data;
        console.log("Profile updated successfully:", updatedProfile);

        setSuccess(true);
        setError(null);
        onClose();
      } else {
        // const errorData = await response.data();
        throw new Error(response.data.detail || "Failed to create profile.");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        console.error("Error updating profile:", err.message);
      }
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: PetProfileData) => {
    if (petProfile) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  };

  const handleUpload = async (url: string) => {
    setPetProfilePicture(url);
    console.log("petProfilePicture : ", petProfilePicture);

    // Update the form's value for pet profile_picture_src
    setValue("profile_picture_src", petProfilePicture || "");
  };

  const handleMultiUpload = (urls: string[]) => {
    // Combine existing URLs with new ones
    const currentPictureList = getValues("pet_bio_picture_src_list") || "";
    const updatedPictureList = currentPictureList
      ? `${currentPictureList},${urls.join(",")}`
      : urls.join(",");

    setPetBioPictureSrcList(updatedPictureList);
    setValue("pet_bio_picture_src_list", updatedPictureList);
  };

  const petOptions = [
    { name: "dog", id: "1" },
    { name: "cat", id: "2" },
    { name: "rabbit", id: "3" },
    { name: "bird", id: "4" },
    { name: "fish", id: "5" },
  ];

  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 text-lg　mb-2 leading-tight focus:outline-none focus:bg-white";
  const labelClass =
    "block tracking-wide text-gray-700 font-bold mb-2 mt-2 text-lg";
  const textAreaClass =
    "appearance-none block w-full bg-gray-200 sm:w-full text-gray-700 border rounded py-2 px-4 md:px-6 md:py-3 leading-tight focus:outline-none focus:bg-white sm:mx-0  shadow-md";
  const checkboxLabelClass =
    "flex flex-col items-center justify-center p-4 text-gray-600 bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50";
  return (
    <div className="flex justify-center p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        {success && (
          <p className="text-green-500 text-xs italic">
            {t("editProfileForm.profileUpdateSuccess")}
          </p>
        )}

        <div className="flex flex-wrap -mx-3 mb-6">
          <button
            onClick={(e) => {
              e.preventDefault();
              onClose();
            }}
            className="text-2xl my-8 mt-0"
          >
            <MdOutlineArrowBackIos />
          </button>

          <h1 className="mx-2 font-bold text-2xl inline">
            {t("dashboard_account_page.edit_button")}
          </h1>
        </div>

        {/* Profile Picture */}

       <div className="mb-6 ">
          <p className={`${labelClass} mb-3`}>
            {t("editPetProfileForm.profilePicture")}
          </p>
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

            {/* Pet Profile Picture */}
            {petProfilePicture || petProfile?.profile_picture_src ? (
              <img
                src={petProfile?.profile_picture_src || petProfilePicture}
                alt={petProfile?.name}
                className={`h-48 w-48 rounded-full object-cover ${
                  imageLoaded ? "block" : "hidden"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            ) : (
              <PiDog className="h-48 w-48 text-gray-400"/>
            )}

          </div>

          {/* ProfilePictureUploader Component */}
          <ProfilePictureUploader
            id={petProfile?.id}
            pictureType="pet_pictures"
            onUpload={(url: string) => {
              handleUpload(url);
              setImageLoaded(false); // Reset loader state for new image
            }}
          />
        </div>

        {/* Pets */}
        <div className="mb-6 ">
          <p className={`${labelClass} mb-3`}>
            {t("editPetProfileForm.typeOfPet")}
          </p>
          <ul className="grid grid-cols-3 gap-4">
            {petOptions.map((pet) => (
              <label
                key={pet.name}
                className={`${checkboxLabelClass} flex items-center`}
              >
                <input
                  type="radio"
                  {...register("type_of_animal")}
                  value={pet.name}
                  className="mb-2"
                />

                {pet.name === "dog" && <LuDog size="2em" />}
                {pet.name === "cat" && <PiCatBold size="2em" />}
                {pet.name === "fish" && <LuFish size="2em" />}
                {pet.name === "bird" && <PiBirdBold size="2em" />}
                {pet.name === "rabbit" && <PiRabbitBold size="2em" />}
                <span>{t(`searchBar.petOptions.${pet.name}`)}</span>
              </label>
            ))}
          </ul>
          {/* {errors.type_of_animal && (
              <p className="text-red-500 text-xs italic">
                {errors.type_of_animal.message}
              </p>
            )} */}
        </div>


        {/* Name */}
        <div className="mb-6">
          <label className={labelClass} htmlFor="name">
            {`${t("editPetProfileForm.name")}`}
          </label>
          <input
            id="name"
            type="text"
            {...register("name", {
              required: "Please enter a name.",
            })}
            className={inputClass}
          />
        </div>
        {/* Birthday */}
        <div className="mb-6">
          <label className={labelClass} htmlFor="birthday">
            {`${t("editPetProfileForm.birthday")}`}
          </label>
          <input
            id="birthday"
            type="date"
            placeholder="2024/08/02"
            {...register("birthday", {
              setValueAs: (value) => (value === "" ? null : value),
            })}
            className={`${inputClass}`}
          />
        </div>

        {/* <div className="flex flex-wrap  "> */}
        {/* Weight */}
        <div className="mb-6">
          <label className={labelClass} htmlFor="weight">
            {`${t("editPetProfileForm.weight")}`}
          </label>
          <input
            id="weight"
            type="number"
            step="0.1"
            {...register("weight", {
              valueAsNumber: true,
              setValueAs: (val) => (val ? null : val),
            })}
            className={inputClass}
          />

   
          {/* Name */}
         <div className="mb-6">
          <label className={labelClass} htmlFor="name">
              {`${t("editPetProfileForm.name")}`}
            </label>
            <input
              id="name"
              type="text"
              {...register("name", {
                required: "Please enter a name.",
              })}
              className={inputClass}
            />
          </div>
          {/* Birthday */}
           <div className="mb-6">
          <label className={labelClass} htmlFor="birthday">
              {`${t("editPetProfileForm.birthday")}`}
            </label>
            <input
              id="birthday"
              type="date"
              placeholder="2024/08/02"
              {...register("birthday", {
                setValueAs: (value) => (value === "" ? null : value),
              })}
              className={`${inputClass}`}
            />
          </div>



          {/* Weight */}
           <div className="mb-6">
          <label className={labelClass} htmlFor="weight">
              {`${t("editPetProfileForm.weight")}`}
            </label>
            <input
              id="weight"
              type="number"
              step="0.1"
              {...register("weight", {
                valueAsNumber: true,
                setValueAs: (val) => (val ? null : val),
              })}
              className={inputClass}
            />
          </div>
          {/* Breed */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={labelClass} htmlFor="subtype">
              {`${t("editPetProfileForm.breed")}`}
            </label>
            <input
              id="subtype"
              type="text"
              {...register("subtype")}
              className={inputClass}
            />
          </div>

 
        {/* Breed */}
        <div className="mb-6">
          <label className={labelClass} htmlFor="subtype">
            {`${t("editPetProfileForm.breed")}`}
          </label>
          <input
            id="subtype"
            type="text"
            {...register("subtype")}
            className={inputClass}
          />
        </div>

        {/* Allergies */}
        <div className="mb-6">
          <label className={labelClass} htmlFor="known_allergies">
            {`${t("editPetProfileForm.allergies")}`}
          </label>
          <input
            id="known_allergies"
            type="text"
            {...register("known_allergies")}
            className={inputClass}
          />
        </div>
        {/* Medications */}
        <div className="mb-6">
          <label className={labelClass} htmlFor="medications">
            {`${t("editPetProfileForm.medications")}`}
          </label>
          <input
            id="medications"
            type="text"
            {...register("medications")}
            className={inputClass}
          />
        </div>
        <div className="mb-6">
          {/* Special needs */}

          <label className={labelClass} htmlFor="special_needs">
            {`${t("editPetProfileForm.specialNeeds")}`}
          </label>
          <textarea
            className={textAreaClass}
            id="special_needs"
            rows={4}
            cols={40}
            {...register("special_needs")}
          />

          {/* Additional Images */}
          <div className="mb-6">
            <h2 className={`${labelClass}`}>Add More Pictures</h2>

            {petBioPictureSrcList ? (
              <ViewMultiPicture picture_src_list={petBioPictureSrcList || ""} />
            ) : (
              ""
            )}

            <MultiPictureUploder
              id={petProfile?.id}
              pictureType="pet_pictures"
              onUpload={handleMultiUpload}
            />
            {petBioPictureSrcList ? (
              <ViewMultiPicture picture_src_list={petBioPictureSrcList || ""} />
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="mb-6">
          <button
            type="submit"
            className="shadow btn-primary focus:shadow-outline focus:outline-nonefont-bold py-2 4 text-sm rounded w-full sm:w-auto sm:mr-4 md:mr-6 md:w-48 md:py-3 md:px-8 mt-6"
            disabled={isLoading}
          >
            {isLoading
              ? t("editProfileForm.saving")
              : t("dashboard_account_page.save_button")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileForm;
