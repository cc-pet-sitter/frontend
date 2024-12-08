import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { PetServices, serviceOptions } from "../../enums/PetServices";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { PetProfileData } from "../../types/userProfile";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;

type EnquiryFormProps = {
  closeEnquiryForm: () => void;
  sitterId: string | undefined;
};

type EnquiryFormData = {
  owner_appuser_id: number;
  sitter_appuser_id: number;
  start_date: string; // ISO string for proper serialization
  end_date: string; // ISO string for proper serialization
  desired_service: PetServices; // Use the enum type
  pet_id_list: string[]; // Array of pet IDs as strings
  additional_info: string | null;
};

type EnquiryFormResponse = {
  id: number;
  owner_appuser_id: number;
  sitter_appuser_id: number;
  inquiry_status: string;
  start_date: string; // ISO string
  end_date: string; // ISO string
  desired_service: string;
  pet_id_list: string; // Stored as comma-separated string
  additional_info: string | null;
  inquiry_submitted: string; // ISO string
  inquiry_finalized: string | null; // ISO string or null
};

const EnquiryForm: React.FC<EnquiryFormProps> = ({
  closeEnquiryForm,
  sitterId,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EnquiryFormData>({
    shouldUseNativeValidation: false,
  });
  const { currentUser, userInfo } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [petOptions, setPetOptions] = useState<PetProfileData[]>([]);
  const navigate = useNavigate();

  const { t } = useTranslation();

  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white";

  const labelClass = "block text-gray-700 text-sm font-bold mb-2";

  useEffect(() => {
    handleGetPets();
  }, []);

  const handleGetPets = async () => {
    try {
      const response = await axiosInstance.get(
        `${apiURL}/appuser/${userInfo?.id}/pet`
      );
      setPetOptions(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmit = async (data: EnquiryFormData) => {
    setIsLoading(true);
    try {
      const backendURL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const idToken = await currentUser?.getIdToken();

      if (!idToken) {
        throw new Error("User is not authenticated.");
      }

      if (!sitterId) {
        throw new Error("Sitter ID is missing.");
      }

      const ownerAppUserId = userInfo?.id;
      if (!ownerAppUserId) {
        throw new Error("Owner AppUser ID is missing.");
      }

      // Serialize pet_id_list to a comma-separated string
      let serializedPetIdList;
      if (Array.isArray(data.pet_id_list)) {
        serializedPetIdList = data.pet_id_list.join(",");
      } else {
        serializedPetIdList = data.pet_id_list; // expected to be a string of a single pet ID
      }

      const payload = {
        owner_appuser_id: ownerAppUserId,
        sitter_appuser_id: Number(sitterId),
        start_date: new Date(data.start_date).toISOString(),
        end_date: new Date(data.end_date).toISOString(),
        desired_service: data.desired_service, // Now correctly using enum values
        pet_id_list: serializedPetIdList, // Serialized string
        additional_info: data.additional_info,
      };

      console.log("Payload to send:", payload); // Debugging

      const response = await fetch(`${backendURL}/inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`, // Include the auth token
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = "Failed to create enquiry.";
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            // Extract and concatenate all error messages
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            errorMessage = errorData.detail.map((e: any) => e.msg).join(", ");
          } else if (typeof errorData.detail === "string") {
            errorMessage = errorData.detail;
          }
        }
        console.error("Backend Error:", errorMessage);
        throw new Error(errorMessage);
      }

      const enquirySubmitted: EnquiryFormResponse = await response.json();
      console.log("Inquiry submitted successfully:", enquirySubmitted);

      setSuccess(true);
      setError(null);

      // Optionally reset the form
      reset();

      // Close the enquiry form after a short delay
      setTimeout(() => {
        closeEnquiryForm();
      }, 1500); // Adjust the delay as necessary
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error creating the enquiry:", error.message);
      setError(error.message);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-lg p-8 bg-white shadow-md rounded-lg"
    >
      {error && <p className="text-red-500 text-sm italic mb-4">{error}</p>}
      {success && (
        <p className="text-brown text mb-4">
          {`${t("enquiryForm.successMessage")}`}
        </p>
      )}

      <div className="flex flex-wrap -mx-3 mb-6">
        {/* Start Date */}
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className={labelClass} htmlFor="start_date">
            {`${t("enquiryForm.startDate")}`}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="start_date"
            type="date"
            placeholder="2024/08/02"
            {...register("start_date", {
              required: "Please enter a start date.",
            })}
            className={inputClass}
          />
          {errors.start_date && (
            <p className="text-red-500 text-xs italic">
              {errors.start_date.message}
            </p>
          )}
        </div>

        {/* End Date */}
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className={labelClass} htmlFor="end_date">
            {`${t("enquiryForm.endDate")}`}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="end_date"
            type="date"
            placeholder="2024/08/10"
            {...register("end_date", {
              required: "Please enter an end date.",
            })}
            className={inputClass}
          />
          {errors.end_date && (
            <p className="text-red-500 text-xs italic">
              {errors.end_date.message}
            </p>
          )}
        </div>
      </div>

      {/* Pets */}
      <div className="mb-6">
        <p className={`${labelClass} mb-3`}>
          {`${t("enquiryForm.petToLookAfter")}`}
          <span className="text-red-500 ml-1">*</span>
        </p>
        {petOptions.length > 0 ? (
          petOptions.map((pet) => (
            <label key={pet.id} className={`${labelClass} flex items-center`}>
              <input
                type="checkbox"
                {...register("pet_id_list", {
                  validate: (value) =>
                    value && value.length > 0
                      ? true
                      : t("enquiryForm.noPetsSelected"),
                })}
                value={pet.id}
                className="mr-2"
              />
              {`${pet.name} (${t(
                `searchBar.petOptions.${pet.type_of_animal}`
              )})`}
            </label>
          ))
        ) : (
          <p className={`${labelClass} font-normal`}>
            {t("enquiryForm.no-pets")}
          </p>
        )}
        {errors.pet_id_list && (
          <p className="text-red-500 text-xs italic">
            {errors.pet_id_list.message}
          </p>
        )}
      </div>

      {/* Desired Service */}
      <div className="mb-6">
        <p className={`${labelClass} mb-3`}>
          {`${t("enquiryForm.desiredService")}`}
          <span className="text-red-500 ml-1">*</span>
        </p>
        {serviceOptions.map((serviceOption) => (
          <label
            key={serviceOption.value}
            className={`${labelClass} flex items-center`}
          >
            <input
              type="radio"
              {...register("desired_service", {
                required: "Please select a desired service.",
              })}
              value={serviceOption.value}
              className="mr-2"
            />
            {t(`enquiryForm.${serviceOption.label}`)}
          </label>
        ))}
        {errors.desired_service && (
          <p className="text-red-500 text-xs italic">
            {errors.desired_service.message}
          </p>
        )}
      </div>

      {/* Additional Information */}
      <div className="mb-6">
        <label className={`${labelClass} block`} htmlFor="additional_info">
          {`${t("enquiryForm.additionalInfo")}`}
        </label>
        <textarea
          id="additional_info"
          className={inputClass}
          rows={4}
          cols={40}
          {...register("additional_info")}
        />
      </div>

      <div className="flex justify-center">
        {!currentUser ? (
          <div className="w-full max-w-lg p-6 bg-gray-100 rounded-lg text-center">
            <h2 className="text-lg font-bold mb-4">
              {t("enquiryForm.loginRequired")}
            </h2>
            <p className="text-gray-600 mb-4">{t("enquiryForm.explanation")}</p>
            <button
              onClick={() => navigate(`/login?redirect=${encodeURIComponent(window.location.pathname)}`)}
              className="btn-secondary py-2 w-24 rounded text-sm mb-4"
            >
              {t("enquiryForm.loginButton")}
            </button>
            <div className="text-center">
              <p className="text-gray-500 mb-2 text-sm">
                {t("login.signupPrompt")}{" "}
                <a
                  onClick={() => navigate(`/signup?redirect=${encodeURIComponent(window.location.pathname)}`)}
                  className="text-black underline cursor-pointer"
                >
                  {t("login.signupButton")}
                </a>
              </p>
            </div>
          </div>
        ) : (
          <button
            type="submit"
            className="shadow btn-primary font-bold py-2 px-4 w-full rounded"
            disabled={isLoading || !currentUser}
          >
            {isLoading ? "Sending..." : `${t("enquiryForm.submit")}`}
          </button>
        )}
      </div>
    </form>
  );
};

export default EnquiryForm;
