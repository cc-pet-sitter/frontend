import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineArrowBackIos } from "react-icons/md";
import axiosInstance from "../../api/axiosInstance";
import MultiPictureUploader from "../services/MultiPictureUploader";
import ViewMultiPicture from "./ViewMultiPicture";
import { Sitter } from "../../types/userProfile.ts";
import AvailabilityManager from "../availability/AvailabilityManager.tsx";
import { TailSpin } from "react-loader-spinner";
import { FaUserCircle } from "react-icons/fa";


const apiURL: string = import.meta.env.VITE_API_BASE_URL;

type Props = {
  closeEditForm: () => void;
  onSave: (updatedProfile: Sitter) => void;
  sitterProfile: Sitter | null;
  fetchAllProfileData: (is_sitter: boolean | null | undefined) => void;
};

const EditSitterProfileForm: React.FC<Props> = ({
  sitterProfile,
  fetchAllProfileData,
  closeEditForm,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [sitterBioPictureSrcList, setSitterBioPictureSrcList] =
    useState<string>(sitterProfile?.sitter_bio_picture_src_list || "");
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [profileSaved, setProfileSaved] = useState<boolean>(!!sitterProfile);

  
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<Sitter>({
    shouldUseNativeValidation: true,
    mode: "onSubmit",
  });
  const { userInfo, setUserInfo } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (sitterProfile) {
      reset({
        sitter_profile_bio: sitterProfile.sitter_profile_bio || "",
        sitter_bio_picture_src_list: sitterProfile.sitter_bio_picture_src_list || "",
        sitter_house_ok: sitterProfile.sitter_house_ok || false,
        owner_house_ok: sitterProfile.owner_house_ok || false,
        visit_ok: sitterProfile.visit_ok || false,
        dogs_ok: sitterProfile.dogs_ok || false,
        cats_ok: sitterProfile.cats_ok || false,
        fish_ok: sitterProfile.fish_ok || false,
        birds_ok: sitterProfile.birds_ok || false,
        rabbits_ok: sitterProfile.rabbits_ok || false,
      });
      setSitterBioPictureSrcList(
        sitterProfile.sitter_bio_picture_src_list || ""
      );
      if (!userInfo?.profile_picture_src) {
        setImageLoaded(true);
      }
    }
  }, [sitterProfile, reset, userInfo]);

  const onSubmit = async (data: Sitter) => {
    data.sitter_bio_picture_src_list = sitterBioPictureSrcList;
    console.log("Submitting data:", data);
    try {
      const response = await axiosInstance.post(
        `${apiURL}/sitter/${userInfo?.id}`,
        {
          sitter_profile_bio: data.sitter_profile_bio,
          sitter_bio_picture_src_list: data.sitter_bio_picture_src_list,
          sitter_house_ok: data.sitter_house_ok,
          owner_house_ok: data.owner_house_ok,
          visit_ok: data.visit_ok,
          dogs_ok: data.dogs_ok,
          cats_ok: data.cats_ok,
          fish_ok: data.fish_ok,
          birds_ok: data.birds_ok,
          rabbits_ok: data.rabbits_ok,
        }
      );

      if (response.status === 200) {
        const updatedProfile = response.data;

        const appuser = updatedProfile.appuser;
        if (appuser) {
          setUserInfo(appuser);
        }
        fetchAllProfileData(true);
        setSuccess(true);
        setError(null);
        setProfileSaved(true);
        // closeEditForm();
      } else {
        throw new Error(response.data.detail || "Failed to update profile.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      setError(error.message);
      setSuccess(false);
      closeEditForm();
    }
  };

  const handleMultiUpload = (urls: string[]) => {
    // Combine existing URLs with new ones
    const currentPictureList = getValues("sitter_bio_picture_src_list") || "";
    const updatedPictureList = currentPictureList
      ? `${currentPictureList},${urls.join(",")}`
      : urls.join(",");

    setSitterBioPictureSrcList(updatedPictureList);
    setValue("sitter_bio_picture_src_list", updatedPictureList);
  };

  // Validation logic for at least one checkbox
  const validateAtLeastOneSelected = (keys: Array<keyof Sitter>) => {
    const values = getValues();
    return (
      keys.some((key) => values[key] === true) ||
      "Please select at least one option."
    );
  };

  // Shared styles
  const textAreaClass =
    "appearance-none block w-11/12 bg-gray-200 sm:w-full text-gray-700 border rounded py-2 px-4 md:px-6 md:py-3 leading-tight focus:outline-none focus:bg-white sm:mx-0 sm:-mr-4 shadow-md";
  const labelClass =
    "block tracking-wide text-gray-700 font-bold mb-2 mt-4 text-lg";
  const inputClass = "block tracking-wide text-gray-700 mb-2 text-lg";

  const petOptions = ["Dog", "Cat", "Fish", "Bird", "Rabbit"];
  const petOptionsKey: Array<keyof Sitter> = [
    "dogs_ok",
    "cats_ok",
    "fish_ok",
    "birds_ok",
    "rabbits_ok",
  ];
  const serviceOptions = ["Boarding", "Stay in", "Drop in"];
  const serviceOptionsKey: Array<keyof Sitter> = [
    "owner_house_ok",
    "sitter_house_ok",
    "visit_ok",
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg mx-4 my-4 sm:mx-20 lg:mx-30"
    >
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      {success && (
        <p className="text-green-500 text-xs italic">
          Profile updated successfully!
        </p>
      )}

      {/* Back Button and Title */}
      <div className="mb-6">
        <button
          onClick={(e) => {
            e.preventDefault();
            closeEditForm();
          }}
          className="text-2xl my-8 mt-0"
        >
          <MdOutlineArrowBackIos />
        </button>

        <h1 className="mx-2 font-bold text-2xl inline">
          {t("dashboard_Sitter_Profile_page.edit_button")}
        </h1>
        
        {/* Profile Picture */}
        <div className="flex flex-col sm:flex-row items-center p-6">
          {/* Profile Picture taken from appuser profile picture or Loader */}
          <div className="relative h-48 w-48">
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
            {userInfo?.profile_picture_src ? (
              <img
                src={userInfo.profile_picture_src}
                alt={`${userInfo?.firstname} ${userInfo?.lastname}`}
                className={`h-48 w-48 rounded-full object-cover ${
                  imageLoaded ? "block" : "hidden"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            ) : (
              <FaUserCircle className="h-48 w-48 text-gray-400"/>
            )}
          </div>
        </div>

        {/* Introduction */}
        <div className="flex flex-col mt-4 items-start">
          <label className={`${labelClass}`} htmlFor="introduction">
            {t("dashboard_Sitter_Profile_page.introduction")}
          </label>
          <textarea
            className={textAreaClass}
            rows={4}
            cols={40}
            id="introduction"
            {...register("sitter_profile_bio", {
              required: "Please fill out your introduction.",
            })}
          />
          {errors.sitter_profile_bio && (
            <p className="text-red-500 text-xs italic">
              {errors.sitter_profile_bio.message}
            </p>
          )}
        </div>
      </div>
      
      {/* Pets */}
      <div className="mb-6">
        <p className={`${labelClass} mb-3`}>
          {t("dashboard_Sitter_Profile_page.pet_service")}
        </p>
        {petOptionsKey.map((pet, index) => (
          <label
            key={pet}
            className={`${inputClass} flex items-center`}
            htmlFor={`${pet}_ok`}
          >
            <input
              id={`${pet}_ok`}
              type="checkbox"
              {...register(pet, {
                validate: () =>
                  validateAtLeastOneSelected(petOptionsKey) ||
                  "Please select at least one pet.",
              })}
              className="mr-2"
            />
            {petOptions[index]}
          </label>
        ))}
        {errors.dogs_ok ||
        errors.cats_ok ||
        errors.fish_ok ||
        errors.birds_ok ||
        errors.rabbits_ok ? (
          <p className="text-red-500 text-xs italic">
            {errors.dogs_ok?.message ||
              errors.cats_ok?.message ||
              errors.fish_ok?.message ||
              errors.birds_ok?.message ||
              errors.rabbits_ok?.message ||
              "Please select at least one pet."}
          </p>
        ) : null}
      </div>
      
      {/* Types of Service You Offer */}
      <div className="mb-6">
        <p className={`${labelClass} mb-3`}>
          {t("dashboard_Sitter_Profile_page.type_service")}
        </p>
        {serviceOptionsKey.map((service, index) => (
          <label
            key={service}
            className={`${inputClass} flex items-center`}
            htmlFor={`${service}_ok`}
          >
            <input
              id={`${service}_ok`}
              type="checkbox"
              {...register(service, {
                validate: () =>
                  validateAtLeastOneSelected(serviceOptionsKey) ||
                  "Please select at least one service.",
              })}
              className="mr-2"
            />
            {serviceOptions[index]}
          </label>
        ))}
        {/* Error Message for Services */}
        {errors.sitter_house_ok || errors.owner_house_ok || errors.visit_ok ? (
          <p className="text-red-500 text-xs italic">
            {errors.sitter_house_ok?.message ||
              errors.owner_house_ok?.message ||
              errors.visit_ok?.message ||
              "Please select at least one service."}
          </p>
        ) : null}
      </div>

      {/* Availability Manager: Render Only After Profile is Saved */}
      {profileSaved ? (
        <div className="mt-6 -z-50">
          <AvailabilityManager />
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-blue-500 text-sm italic">
            {t("Please save your profile first to manage availabilities.")}
          </p>
        </div>
      )}

      {/* Additional Pictures */}
      <div className="mt-6">
        <h2 className={`${labelClass}`}>Add More Pictures</h2>
        {sitterBioPictureSrcList ? (
          <ViewMultiPicture picture_src_list={sitterBioPictureSrcList || ""} />
        ) : (
          ""
        )}
        <MultiPictureUploader
          id={userInfo?.id}
          pictureType="sitter_pictures"
          onUpload={handleMultiUpload}
        />
      </div>

      {/* Save Profile */}
      <div className="flex justify-center md:justify-end ">
        <button
          type="submit"
          className="shadow btn-primary focus:shadow-outline focus:outline-nonefont-bold py-2 px-4 text-sm rounded w-full mr-8 sm:w-auto sm:mr-4 md:mr-6 md:w-48 md:py-3 md:px-8 mt-6"
        >
          {t("dashboard_Sitter_Profile_page.save_profile_button")}
        </button>
      </div>
    </form>
  );
};

export default EditSitterProfileForm;
