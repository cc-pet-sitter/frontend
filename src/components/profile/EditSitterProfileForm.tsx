import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineArrowBackIos } from "react-icons/md";
import axios from "axios";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;

type Props = {
  closeEditForm: () => void;
  onSave: (updatedProfile: EditFormData) => void;
  sitterProfile: SitterProfile | null;
  fetchSitterProfile: (is_sitter: boolean | null | undefined) => void;
};

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

type EditFormData = {
  sitter_profile_bio: string | null;
  sitter_house_ok: boolean | null;
  owner_house_ok: boolean | null;
  visit_ok: boolean | null;
  dogs_ok: boolean | null;
  cats_ok: boolean | null;
  fish_ok: boolean | null;
  birds_ok: boolean | null;
  rabbits_ok: boolean | null;
};

const EditSitterProfileForm: React.FC<Props> = ({
  sitterProfile,
  fetchSitterProfile,
  closeEditForm,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors },
  } = useForm<EditFormData>({
    shouldUseNativeValidation: true,
    mode: "onSubmit",
  });
  const { currentUser, userInfo, setUserInfo } = useAuth();
  const { t } = useTranslation();
  console.log("CurrentUser: ", currentUser);

  useEffect(() => {
    if (sitterProfile) {
      reset({
        sitter_profile_bio: sitterProfile.sitter_profile_bio || "",
        sitter_house_ok: sitterProfile.sitter_house_ok || false,
        owner_house_ok: sitterProfile.owner_house_ok || false,
        visit_ok: sitterProfile.visit_ok || false,
        dogs_ok: sitterProfile.dogs_ok || false,
        cats_ok: sitterProfile.cats_ok || false,
        fish_ok: sitterProfile.fish_ok || false,
        birds_ok: sitterProfile.birds_ok || false,
        rabbits_ok: sitterProfile.rabbits_ok || false,
      });
    }
  }, [sitterProfile, reset]);

  const onSubmit = async (data: EditFormData) => {
    try {
      const response = await axios.post(`${apiURL}/sitter/${userInfo?.id}`, {
        // data,
        sitter_profile_bio: data.sitter_profile_bio,
        sitter_house_ok: data.sitter_house_ok,
        owner_house_ok: data.owner_house_ok,
        visit_ok: data.visit_ok,
        dogs_ok: data.dogs_ok,
        cats_ok: data.cats_ok,
        fish_ok: data.fish_ok,
        birds_ok: data.birds_ok,
        rabbits_ok: data.rabbits_ok,
      });

      if (response.status === 200) {
        const updatedProfile = response.data;

        const appuser = updatedProfile.appuser;
        if (appuser) {
          setUserInfo(appuser);
        }
        fetchSitterProfile(true);
        setSuccess(true);
        setError(null);
        // onSave(updatedProfile);
        closeEditForm();
      } else {
        throw new Error(response.data.detail || "Failed to update profile.");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      setError(error.message);
      setSuccess(false);
    }
  };

  // Validation logic for at least one checkbox
  const validateAtLeastOneSelected = (keys: Array<keyof EditFormData>) => {
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
  const petOptionsKey: Array<keyof EditFormData> = [
    "dogs_ok",
    "cats_ok",
    "fish_ok",
    "birds_ok",
    "rabbits_ok",
  ];
  const serviceOptions = ["Boarding", "Stay in", "Drop in"];
  const serviceOptionsKey: Array<keyof EditFormData> = [
    "owner_house_ok",
    "sitter_house_ok",
    "visit_ok",
  ];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg mx-4 my-4 sm:mx-20 lg:mx-30
    "
    >
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      {success && (
        <p className="text-green-500 text-xs italic">
          Profile updated successfully!
        </p>
      )}

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

        <div className="mr-0 mb-4 grid place-items-center sm:mr-6 sm:mb-0">
          <img
            alt="Petter Sitter Image"
            // src={sitterProfile.sitter_profile_bio}
            src={"https://live.staticflickr.com/62/207176169_60738224b6_c.jpg"}
            className="h-32 w-32 rounded-full object-cover object-center sm:h-32 sm:w-32"
          />
          <div className="">
            <div className="shadow-custom bg-white  focus:shadow-outline focus:outline-none text-black py-2 px-2 text-xs rounded-full">
              Edit Photo
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-4 items-start">
          <label className={`${labelClass}`} htmlFor="introduction">
            Introduction
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
      <div className="mb-6">
        {/* Pets */}
        <p className={`${labelClass} mb-3`}>Pets you can sit</p>
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
      <div className="mb-6">
        {/* Types of Service You Offer */}
        <p className={`${labelClass} mb-3`}>Types of Service You Offer</p>
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

      <div className="flex justify-center md:justify-end ">
        <button
          type="submit"
          className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 text-sm rounded w-full mr-8 sm:w-auto sm:mr-4 md:mr-6 md:w-48 md:py-3 md:px-8 mt-6"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditSitterProfileForm;
