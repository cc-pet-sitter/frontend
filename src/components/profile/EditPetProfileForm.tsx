import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineArrowBackIos } from "react-icons/md";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;

type Props = {
  closeEditForm: () => void;
  // onSave: (updatedProfile: EditFormData) => void;
  petProfile: EditProfileFormData | null;
  // fetchPetProfiles: () => void;
  onClose: () => void;
};

type EditProfileFormData = {
  id: Number;
  name: string;
  type_of_animal: string;
  subtype: string | null;
  weight: number | null;
  birthday: string;
  known_allergies: string | null;
  medications: string | null;
  special_needs: string | null;
  appuser_id: number;
  profile_picture_src: string | undefined;
};

const EditProfileForm: React.FC<Props> = ({
  closeEditForm,
  petProfile,
  onClose,
}) => {
  const { register, handleSubmit, reset } = useForm<EditProfileFormData>({
    shouldUseNativeValidation: true,
  });
  const { currentUser, userInfo } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { t } = useTranslation();

  // Pre-fill form if editing an existing pet profile
  useEffect(() => {
    if (petProfile) {
      reset({
        name: petProfile.name || "",
        type_of_animal: petProfile.type_of_animal || "",
        subtype: petProfile.subtype || "",
        weight: petProfile.weight || undefined,
        birthday: petProfile.birthday || "",
        known_allergies: petProfile.known_allergies || "",
        medications: petProfile.medications || "",
        special_needs: petProfile.special_needs || "",
      });
    }
  }, [petProfile, reset]);

  const handleCreate = async (data: EditProfileFormData) => {
    console.log(data);
    setIsLoading(true);
    try {
      const idToken = await currentUser?.getIdToken();
      const response = await fetch(`${apiURL}/appuser/${userInfo?.id}/pet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const newProfile = await response.json();
        console.log("Profile created successfully:", newProfile);

        setSuccess(true);
        setError(null);
        onClose();
        // closeEditForm();
        // fetchPetProfiles();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create profile.");
      }
    } catch (error: any) {
      console.error("Error creating profile:", error.message);
      setError(error.message);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data: EditProfileFormData) => {
    setIsLoading(true);
    try {
      const idToken = await currentUser?.getIdToken();
      const response = await fetch(`${apiURL}/pet/${petProfile?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        console.log("Profile updated successfully:", updatedProfile);

        setSuccess(true);
        setError(null);
        onClose();
        // closeEditForm();
        // fetchPetProfiles();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to create profile.");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      setError(error.message);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: EditProfileFormData) => {
    if (petProfile) {
      await handleUpdate(data);
    } else {
      await handleCreate(data);
    }
  };

  const petOptions = [
    { name: "dog", id: "1" },
    { name: "cat", id: "2" },
    { name: "fish", id: "3" },
    { name: "bird", id: "4" },
    { name: "rabbit", id: "5" },
  ];

  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 text-lg　mb-2 leading-tight focus:outline-none focus:bg-white";
  const labelClass =
    "block tracking-wide text-gray-700 font-bold mb-2 mt-2 text-lg";
  const textAreaClass =
    "appearance-none block w-full bg-gray-200 sm:w-full text-gray-700 border rounded py-2 px-4 md:px-6 md:py-3 leading-tight focus:outline-none focus:bg-white sm:mx-0 sm:-mr-4 shadow-md";

  return (
    <div className="flex justify-center p-8">
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
        {/* <div className="mr-0 mb-4 grid place-items-center sm:mr-6 sm:mb-0">
            <img
              alt="Petter Sitter Image"
              // src={sitterProfile.sitter_profile_bio}
              src={
                "https://live.staticflickr.com/62/207176169_60738224b6_c.jpg"
              }
              className="h-32 w-32 rounded-full object-cover object-center sm:h-32 sm:w-32"
            />
            <div className="">
              <div className="shadow-custom bg-white  focus:shadow-outline focus:outline-none text-black py-2 px-2 text-xs rounded-full">
                Edit Photo
              </div>
            </div>
          </div> */}
        {/* Pets */}
        <div className="mb-6 ">
          <p className={`${labelClass} mb-3`}>
            {t("editPetProfileForm.typeOfPet")}
          </p>
          {petOptions.map((pet) => (
            <label key={pet.name} className={`${labelClass} flex items-center`}>
              <input
                type="radio"
                {...register("type_of_animal")}
                value={pet.name}
                className="mr-2"
              />
              {t(`searchBar.petOptions.${pet.name}`)}
            </label>
          ))}
          {/* {errors.type_of_animal && (
              <p className="text-red-500 text-xs italic">
                {errors.type_of_animal.message}
              </p>
            )} */}
        </div>

        <div className="flex flex-wrap  ">
          {/* Name */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
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
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={labelClass} htmlFor="birthday">
              {`${t("editPetProfileForm.birthday")}`}
            </label>
            <input
              id="birthday"
              type="date"
              placeholder="2024/08/02"
              {...register("birthday", {
                required: "Please select a birthday.",
              })}
              className={`${inputClass}`}
            />
          </div>
        </div>

        <div className="flex flex-wrap  ">
          {/* Weight */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={labelClass} htmlFor="weight">
              {`${t("editPetProfileForm.weight")}`}
            </label>
            <input
              id="weight"
              type="number"
              {...register("weight", {
                required: "Please enter a weight.",
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
              {...register("subtype", {
                required: "Please enter a breed.",
              })}
              className={inputClass}
            />
          </div>
        </div>
        <div className="flex flex-wrap ">
          {/* Allergies */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
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
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
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
        </div>
        <div className="mb-6">
          {/* Special needs */}

          <div className="w-full px-3 mb-6 md:mb-0">
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
          </div>
        </div>
        <div className="flex justify-center md:justify-end px-3">
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
