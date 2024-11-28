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
  const { register, handleSubmit, reset } = useForm<EditFormData>({
    shouldUseNativeValidation: true,
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

  // Shared styles
  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white";
  const labelClass =
    "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";

  const petOptions = ["dog", "cat", "fish", "bird", "rabbit"];
  const petOptionsKey: Array<keyof EditFormData> = [
    "dogs_ok",
    "cats_ok",
    "fish_ok",
    "birds_ok",
    "rabbits_ok",
  ];
  const serviceOptions = ["boarding", "stay in", "drop in"];
  const serviceOptionsKey: Array<keyof EditFormData> = [
    "owner_house_ok",
    "sitter_house_ok",
    "visit_ok",
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      {success && (
        <p className="text-green-500 text-xs italic">
          Profile updated successfully!
        </p>
      )}

      <div className="mb-6">
        <button className="text-2xl mx-2 my-2">
          <MdOutlineArrowBackIos />
        </button>

        <h1 className="mx-2 my-2 font-bold text-2xl inline">
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
        <label
          className={`${labelClass} flex items-center mt-4`}
          htmlFor="introduction"
        >
          Introduction Profile
          <textarea
            className={inputClass}
            rows={4}
            cols={40}
            id="introduction"
            {...register("sitter_profile_bio", {
              required: "Please fill out your introduction.",
            })}
          />
        </label>
      </div>
      <div className="mb-6">
        {/* Pets */}
        <p className={`${labelClass} mb-3`}>Pets you can sit</p>
        {petOptionsKey.map((pet, index) => (
          <label
            key={pet}
            className={`${labelClass} flex items-center`}
            htmlFor={`${pet}_ok`}
          >
            <input
              id="pet_options"
              type="checkbox"
              {...register(pet)}
              className="mr-2"
            />
            {petOptions[index]}
          </label>
        ))}
      </div>
      <div className="mb-6">
        {/* Types of Service You Offer */}
        <p className={`${labelClass} mb-3`}>Types of Service You Offer</p>
        {serviceOptionsKey.map((service, index) => (
          <label
            key={service}
            className={`${labelClass} flex items-center`}
            htmlFor={`${service}_ok`}
          >
            <input
              id="service_options"
              type="checkbox"
              {...register(service)}
              className="mr-2"
            />
            {serviceOptions[index]}
          </label>
        ))}
      </div>

      <div className="md:flex md:items-center">
        <div className="md:w-2/3">
          <button
            type="submit"
            className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-5 text-sm rounded"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditSitterProfileForm;
