import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import axios from "axios";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;

type Props = {
  closeEditProfileForm: () => void;
  sitterProfile: object | null;
  onSave: (updatedProfile: EditFormData) => void;
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

// const is_sitter = false;

const EditSitterProfileForm: React.FC<Props> = ({
  closeEditProfileForm,
  sitterProfile,
  onSave,
}) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { register, handleSubmit, reset } = useForm({
    shouldUseNativeValidation: true,
  });
  const { userInfo } = useAuth();

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
    console.log(data);

    try {
      const response = await axios.post(
        `${apiURL}/sitter/${userInfo?.user_id}`,
        {
          data,
        }
      );

      if (response.status === 200) {
        const updatedProfile = await response.data();
        console.log("Profile updated successfully:", updatedProfile);
        onSave(updatedProfile);
        setSuccess(true);
        setError(null);

        // Close the edit form
        // closeEditForm();
      }

      const errorData = await response.data();
      throw new Error(errorData.detail || "Failed to update profile.");
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

  const petOptions = ["Dog", "Cat", "Fish", "Bird", "Rabbit"];
  const serviceOptions = ["Boarding", "Stay in", "Drop in"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      {success && (
        <p className="text-green-500 text-xs italic">
          Profile updated successfully!
        </p>
      )}

      <div className="mb-6">
        <label
          className={`${labelClass} flex items-center`}
          htmlFor="introduction"
        >
          Introduction Profile:
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
        <p className={`${labelClass} mb-3`}>Pets you can sit:</p>
        {petOptions.map((pet) => (
          <label
            key={pet}
            className={`${labelClass} flex items-center`}
            htmlFor="pet_options"
          >
            <input
              id="pet_options"
              type="checkbox"
              {...register(`${pet}_ok`, {
                required: "Please chose pet type.",
              })}
              {...register("pets")}
              value={pet.toLowerCase()}
              className="mr-2"
            />
            {pet}
          </label>
        ))}
      </div>
      <div className="mb-6">
        {/* Types of Service You Offer */}
        <p className={`${labelClass} mb-3`}>Types of Service You Offer:</p>
        {serviceOptions.map((service) => (
          <label
            key={service}
            className={`${labelClass} flex items-center`}
            htmlFor="serice_options"
          >
            <input
              id="service_options"
              type="checkbox"
              {...register(`${service}_ok`, {
                required: "Please chose service options.",
              })}
              value={service.toLowerCase()}
              className="mr-2"
            />
            {service}
          </label>
        ))}
      </div>

      <div className="md:flex md:items-center">
        <div className="md:w-2/3">
          <button
            type="submit"
            className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            onClick={closeEditProfileForm}
          >
            {is_sitter ? "Save" : "Create a sitter profile"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditSitterProfileForm;
