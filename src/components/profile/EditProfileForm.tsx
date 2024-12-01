import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineArrowBackIos } from "react-icons/md";

type Props = {
  closeEditForm: () => void;
};

type EditProfileFormData = {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  postal_code: string;
  prefecture: string;
  city_ward: string;
  street_address: string;
  japanese_ok: boolean;
  english_ok: boolean;
};

const EditProfileForm: React.FC<Props> = ({ closeEditForm }) => {
  const { register, handleSubmit, reset } = useForm<EditProfileFormData>({
    shouldUseNativeValidation: true,
  });
  const { currentUser, userInfo } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUserInfo } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    if (userInfo) {
      reset({
        firstname: userInfo.firstname || "",
        lastname: userInfo.lastname || "",
        email: userInfo.email || "",
        postal_code: userInfo.postal_code || "",
        prefecture: userInfo.prefecture || "",
        city_ward: userInfo.city_ward || "",
        street_address: userInfo.street_address || "",
        japanese_ok: userInfo.japanese_ok || false,
        english_ok: userInfo.english_ok || false,
      });
    }
  }, [userInfo, reset]);

  const onSubmit = async (data: EditProfileFormData) => {
    setIsLoading(true);
    try {
      const backendURL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const idToken = await currentUser?.getIdToken();
      const response = await fetch(`${backendURL}/appuser/${userInfo?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile.");
      }

      const updatedUser = await response.json();
      console.log("Profile updated successfully:", updatedUser);

      setUserInfo(updatedUser);

      setSuccess(true);
      setError(null);

      closeEditForm();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error updating profile:", error.message);
      setError(error.message);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 text-lg　mb-2 leading-tight focus:outline-none focus:bg-white";
  const labelClass =
    "block tracking-wide text-gray-700 font-bold mb-2 mt-2 text-lg";

  const prefectureOptions = ["Tokyo", "Saitama", "Chiba"];

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
              closeEditForm();
            }}
            className="text-2xl my-8 mt-0"
          >
            <MdOutlineArrowBackIos />
          </button>

          <h1 className="mx-2 font-bold text-2xl inline">
            {t("dashboard_account_page.edit_button")}
          </h1>

          {/* <div className="flex flex-wrap -mx-3 mb-6"> */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className={labelClass} htmlFor="firstName">
                {`${t("editProfileForm.firstname")}`}
              </label>
              <input
                id="firstName"
                type="text"
                {...register("firstname", {
                  required: "Please enter your first name.",
                })}
                className={inputClass}
              />
            </div>
            {/* Last Name */}
            <div className="w-full px-3 mb-6 md:mb-0">
              <label className={labelClass} htmlFor="lastName">
                {`${t("editProfileForm.lastname")}`}
              </label>
              <input
                id="lastName"
                type="text"
                {...register("lastname", {
                  required: "Please enter your last name.",
                })}
                className={`${inputClass}`}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          {/* Email */}
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className={labelClass} htmlFor="email">
              {`${t("editProfileForm.email")}`}
            </label>
            <input
              id="email"
              type="email"
              {...register("email", {
                required: "Please enter your email.",
              })}
              className={inputClass}
              disabled // Disable email field if it shouldn't be editable
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          {/* Postcode */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={labelClass} htmlFor="postcode">
              {`${t("editProfileForm.postCode")}`}
            </label>
            <input
              id="postcode"
              type="text"
              {...register("postal_code", {
                required: "Please enter your postcode.",
              })}
              className={inputClass}
            />
          </div>
          {/* Prefecture */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={labelClass} htmlFor="prefecture">
              {`${t("editProfileForm.prefecture")}`}
            </label>
            <select
              id="prefecture"
              {...register("prefecture", {
                required: "Please select a prefecture.",
              })}
              className={`${inputClass} pr-8`}
            >
              <option value="">Select Prefecture</option>
              {prefectureOptions.map((pref) => (
                <option key={pref} value={pref}>
                  {pref}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          {/* City */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={labelClass} htmlFor="city">
              {`${t("editProfileForm.cityWard")}`}
            </label>
            <input
              id="city"
              type="text"
              {...register("city_ward", {
                required: "Please enter a city.",
              })}
              className={inputClass}
            />
          </div>
          {/* Street */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={labelClass} htmlFor="street">
              {`${t("editProfileForm.houseAndStreet")}`}
            </label>
            <input
              id="street"
              type="text"
              {...register("street_address", {
                required: "Please enter a street.",
              })}
              className={inputClass}
            />
          </div>
        </div>
        <div className="mb-6">
          {/* Languages */}
          <p className={`${labelClass} mb-3`}>{`${t(
            "editProfileForm.languages"
          )}`}</p>
          <label className={`${labelClass} flex items-center`}>
            {`${t("editProfileForm.japanese")}`}
            <input
              type="checkbox"
              {...register("japanese_ok")}
              className="mr-2"
            />
          </label>
          <label className={`${labelClass} flex items-center`}>
            {`${t("editProfileForm.english")}`}
            <input
              type="checkbox"
              {...register("english_ok")}
              className="mr-2"
            />
          </label>
        </div>
        <div className="flex justify-center md:justify-end">
          <button
            type="submit"
            className="shadow btn-primary focus:shadow-outline focus:outline-nonefont-bold py-2 px-4 text-sm rounded w-full mr-8 sm:w-auto sm:mr-4 md:mr-6 md:w-48 md:py-3 md:px-8 mt-6"
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
