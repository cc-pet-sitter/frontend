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
import { LuDog, LuFish, LuSchool } from "react-icons/lu";
import { TbHomeFilled, TbHomeMove } from "react-icons/tb";
import { PiRabbitBold, PiCatBold, PiBirdBold } from "react-icons/pi";
import { FaUserCircle } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";

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
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<Sitter>({
    shouldUseNativeValidation: false,
    mode: "onSubmit",
  });
  const { userInfo, setUserInfo } = useAuth();
  const { t } = useTranslation();
  const [sitterBioPictureSrcList, setSitterBioPictureSrcList] =
    useState<string>(sitterProfile?.sitter_bio_picture_src_list || "");
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!userInfo?.profile_picture_src) {
      setImageLoaded(true);
    }
  }, [userInfo]);

  useEffect(() => {
    if (sitterProfile) {
      reset({
        sitter_profile_bio: sitterProfile.sitter_profile_bio || "",
        sitter_bio_picture_src_list:
          sitterProfile.sitter_bio_picture_src_list || "",
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
    }
  }, [sitterProfile, reset]);

  const onSubmit = async (data: Sitter) => {
    data.sitter_bio_picture_src_list = sitterBioPictureSrcList;
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
        closeEditForm();
      } else {
        throw new Error(response.data.detail || "Failed to update profile.");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      setError(error.message);
      setSuccess(false);
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

  const validateAtLeastOneSelected = (keys: Array<keyof Sitter>) => {
    const values = getValues();
    return (
      keys.some((key) => values[key] === true) ||
      "Please select at least one option."
    );
  };

  // Shared styles
  const textAreaClass =
    "appearance-none block bg-gray-200 sm:w-full text-gray-700 border rounded py-2 px-4 md:px-6 md:py-3 leading-tight focus:outline-none focus:bg-white sm:mx-0 sm:-mr-4 shadow-md";
  const checkboxLabelClass =
    "flex flex-col items-center justify-center p-4 text-gray-600 bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50";
  const labelClass = "block text-gray-700 text-lg font-bold mb-2";

  const petOptions = ["dog", "cat", "fish", "bird", "rabbit"];
  const petOptionsKey: Array<keyof Sitter> = [
    "dogs_ok",
    "cats_ok",
    "fish_ok",
    "birds_ok",
    "rabbits_ok",
  ];
  const serviceOptions = ["boarding", "stayIn", "dropIn"];
  const serviceOptionsKey: Array<keyof Sitter> = [
    "sitter_house_ok",
    "owner_house_ok",
    "visit_ok",
  ];

  return (
    <div className="flex justify-center p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        {success && (
          <p className="text-green-500 text-xs italic">
            {t("dashboard_Sitter_Profile_page.pageEdited")}
          </p>
        )}

        <div className="mb-2">
          <div className="flex flex-wrap -mx-3 mb-6 my-2">
            <button
              onClick={(e) => {
                e.preventDefault();
                closeEditForm();
              }}
              className="ml-2 flex"
            >
              <MdOutlineArrowBackIos className="mr-3 mt-1" />{" "}
              <p>{t("request_details_page.goBack")}</p>
            </button>
          </div>

          {/* Profile Picture */}
          <div className="flex items-center justify-center pb-4">
            {!imageLoaded && (
              <div className="flex items-center justify-center bg-gray-300 h-48 w-48 rounded-full">
                <TailSpin
                  height="50"
                  width="50"
                  color="#fabe25"
                  ariaLabel="loading"
                />
              </div>
            )}
            {userInfo?.profile_picture_src ? (
              <img
                src={userInfo.profile_picture_src}
                alt={userInfo.firstname || ""}
                className={`h-48 w-48 rounded-full object-cover ${
                  imageLoaded ? "block" : "hidden"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            ) : (
              <div className="flex items-center justify-center h-48 w-48 rounded-full ">
                <FaUserCircle className="h-48 w-48 text-gray-300" />
              </div>
            )}
          </div>

          {/* Introduction */}
          <div className="flex flex-col mt-4 items-start">
            <label
              className={`${labelClass} flex items-center`}
              htmlFor="introduction"
            >
              {t("dashboard_Sitter_Profile_page.introduction")}
              <span className="text-red-500 ml-1">*</span>
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
        <div className="my-6">
          <p className={`${labelClass} my-3`}>
            {t("dashboard_Sitter_Profile_page.pet_service")}
            <span className="text-red-500 ml-1">*</span>
          </p>
          <ul className="grid grid-cols-3 gap-4">
            {petOptionsKey.map((pet, index) => (
              <li key={pet}>
                {/* Using sr-only to hide the checkbox but still keep it focusable */}
                <input
                  type="checkbox"
                  id={`${pet}_ok`}
                  className="sr-only peer"
                  {...register(pet, {
                    validate: () =>
                      validateAtLeastOneSelected(petOptionsKey) ||
                      "Please select at least one pet.",
                  })}
                />
                <label
                  htmlFor={`${pet}_ok`}
                  className={`${checkboxLabelClass} flex items-center`}
                >
                  {pet === "dogs_ok" && <LuDog size="2em" />}
                  {pet === "cats_ok" && <PiCatBold size="2em" />}
                  {pet === "fish_ok" && <LuFish size="2em" />}
                  {pet === "birds_ok" && <PiBirdBold size="2em" />}
                  {pet === "rabbits_ok" && <PiRabbitBold size="2em" />}
                  <span>{t(`searchBar.petOptions.${petOptions[index]}`)}</span>
                </label>
              </li>
            ))}
          </ul>
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
            <span className="text-red-500 ml-1">*</span>
          </p>

          <ul className="grid grid-cols-3 gap-4">
            {serviceOptionsKey.map((service, index) => (
              <li key={service}>
                <input
                  type="checkbox"
                  id={`${service}`}
                  className="hidden peer"
                  {...register(service, {
                    validate: () =>
                      validateAtLeastOneSelected(serviceOptionsKey) ||
                      "Please select at least one service.",
                  })}
                />
                <label
                  htmlFor={`${service}`}
                  className={`${checkboxLabelClass} flex items-center`}
                >
                  {service === "sitter_house_ok" && <LuSchool size="2em" />}
                  {service === "owner_house_ok" && <TbHomeFilled size="2em" />}
                  {service === "visit_ok" && <TbHomeMove size="2em" />}
                  <span>
                    {t(`searchBar.serviceOptions.${serviceOptions[index]}`)}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {/* Error Message for Services */}
          {errors.sitter_house_ok ||
          errors.owner_house_ok ||
          errors.visit_ok ? (
            <p className="text-red-500 text-xs italic">
              {errors.sitter_house_ok?.message ||
                errors.owner_house_ok?.message ||
                errors.visit_ok?.message ||
                "Please select at least one service."}
            </p>
          ) : null}
        </div>

        {/* Availability Section */}
        <div className="mt-6 relative z-0">
          {/* AvailabilityManager is always displayed */}
          <AvailabilityManager />

          {/* Overlay if user is not a sitter yet */}
          {!userInfo?.is_sitter && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-[9999]">
              <p className="text-sm p-4 text-center border border-brown bg-white rounded text-brown w-1/2">
                {t(t("dashboard_Sitter_Profile_page.save_first"))}
              </p>
            </div>
          )}
        </div>

        {/* Additional Pictures */}
        <div className="mt-6">
          <h2 className={`${labelClass}`}>
            {t("dashboard_Sitter_Profile_page.addMorePictures")}
          </h2>
          {sitterBioPictureSrcList ? (
            <ViewMultiPicture
              picture_src_list={sitterBioPictureSrcList || ""}
            />
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
            className="shadow btn-primary focus:shadow-outline focus:outline-none font-bold py-2 px-4 text-sm rounded w-full sm:w-auto sm:mr-4 md:mr-6 md:w-48 md:py-3 md:px-8 mt-6"
          >
            {t("dashboard_Sitter_Profile_page.save_profile_button")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSitterProfileForm;
