import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdOutlineArrowBackIos } from "react-icons/md";
import ProfilePictureUploader from "../services/ProfilePictureUploader";
import { FaUserCircle } from "react-icons/fa";
import { TailSpin } from "react-loader-spinner";
// import { Pref, City } from "jp-zipcode-lookup";
import LabelWithAsterisk from "../icons/LabelWithAsterisk";
import UnionJack from "../flags/UnionJack";
import Japan from "../flags/Japan";
import { cityOptions } from "../../options/Cities";
import { prefectures } from "../../options/Prefectures";

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
  const [profilePicture, setProfilePicture] = useState<string | undefined>(
    undefined
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<EditProfileFormData>({
    shouldUseNativeValidation: false,
  });
  const { currentUser, userInfo } = useAuth();
  const { setUserInfo } = useAuth();
  const { t } = useTranslation();
  const [selectedPrefecture, setSelectedPrefecture] = useState("");

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
      if (!userInfo?.profile_picture_src && !profilePicture) {
        setImageLoaded(true);
      }
    }
  }, [userInfo, reset, profilePicture]);

  // Handler for postal code changes
  // const handlePostalCodeChange = async (postalCode: string) => {
  //   const cleanedPostalCode = postalCode.replace(/[^0-9]/g, ""); // Remove any non-numeric characters

  //   if (!cleanedPostalCode || cleanedPostalCode.length !== 7) {
  //     return;
  //   }

  //   try {
  //     const prefecture = Pref.byZipcode(postalCode)[0]?.name;
  //     const city = City.byZipcode(postalCode)[0]?.name;

  //     if (prefecture) {
  //       setValue("prefecture", prefecture); // Populate prefecture field
  //     }
  //     if (city) {
  //       setValue("city_ward", city); // Populate city field
  //     }
  //   } catch (err) {
  //     console.error("Failed to fetch address:", err);
  //   }
  // };

  const onSubmit = async (data: EditProfileFormData) => {
    setIsLoading(true);
    try {
      // Clean the postal code to remove non-numeric characters
      const cleanedPostalCode = data.postal_code.replace(/[^0-9]/g, "");

      // Create a new data object with the cleaned postal code
      const sanitizedData = {
        ...data,
        postal_code: cleanedPostalCode,
      };
      const backendURL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const idToken = await currentUser?.getIdToken();
      const response = await fetch(`${backendURL}/appuser/${userInfo?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify(sanitizedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile.");
      }

      const updatedUser = await response.json();
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

  const handleUpload = async (url: string) => {
    setProfilePicture(url);
    setImageLoaded(false);

    const idToken = await currentUser?.getIdToken();
    const backendURL =
      import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

    const response = await fetch(`${backendURL}/appuser/${userInfo?.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        id: userInfo?.id,
        profile_picture_src: url,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.detail || "Failed to save user profile picture.");
    }

    const updatedUser = await response.json();
    setUserInfo(updatedUser);
  };

  const prefectureOptions = Object.values(prefectures);

  const handlePrefectureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    setSelectedPrefecture(selected);

    setValue("prefecture", selected as string);
  };

  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 text-lg　mb-2 leading-tight focus:outline-none focus:bg-white";
  const labelClass =
    "block tracking-wide text-gray-700 font-bold mb-2 mt-2 text-lg";
  const checkboxLabelClass =
    "flex flex-col items-center justify-center p-4 bg-white border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50";

  return (
    <div className="flex justify-center px-8 pt-2 mb-8">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
        {success && (
          <p className="text-green-500 text-xs italic">
            {t("editProfileForm.profileUpdateSuccess")}
          </p>
        )}
        <div className="mb-2">
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
        <div className="flex flex-col items-center mb-6">
          {/* Profile Picture or Loader */}
          <div className="relative h-48 w-48 mb-4">
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
            {userInfo?.profile_picture_src || profilePicture ? (
              <img
                src={userInfo?.profile_picture_src || profilePicture}
                alt={`${userInfo?.firstname} ${userInfo?.lastname}`}
                className={`h-48 w-48 rounded-full object-cover ${
                  imageLoaded ? "block" : "hidden"
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            ) : (
              <div className="flex items-center justify-center  h-48 w-48 rounded-full">
                <FaUserCircle className="h-48 w-48 text-gray-300" />
              </div>
            )}
          </div>

          {/* ProfilePictureUploader Component */}
          <ProfilePictureUploader
            id={userInfo?.id}
            pictureType="user_profile_pictures"
            onUpload={(url: string) => {
              handleUpload(url);
              setImageLoaded(false); // Reset loader state for new image
            }}
          />
        </div>
        <div className="mb-6">
          {/* First Name */}
          <label className={`${labelClass} `} htmlFor="firstName">
            <LabelWithAsterisk
              text={t("editProfileForm.firstname")}
              required={true}
            />
          </label>
          <input
            id="firstName"
            type="text"
            {...register("firstname", {
              required: "Please enter your first name.",
            })}
            className={inputClass}
          />
          {errors.firstname && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.firstname.message}
            </p>
          )}
        </div>
        {/* Last Name */}
        <div className="mb-6">
          <label className={labelClass} htmlFor="lastName">
            <LabelWithAsterisk
              text={t("editProfileForm.lastname")}
              required={true}
            />
          </label>
          <input
            id="lastName"
            type="text"
            {...register("lastname", {
              required: "Please enter your last name.",
            })}
            className={`${inputClass}`}
          />
          {errors.lastname && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.lastname.message}
            </p>
          )}
        </div>
        {/* Email */}
        <div className="mb-6">
          <label className={labelClass} htmlFor="email">
            <LabelWithAsterisk
              text={t("editProfileForm.email")}
              required={true}
            />
          </label>
          <input
            id="email"
            type="email"
            {...register("email", {
              required: "Please enter your email.",
            })}
            className={inputClass}
            disabled
          />
        </div>

        {/* 
        
        VICENTE POSTCODE FORM FILLER 

        <div className="mb-6">
          <label className={labelClass} htmlFor="postal_code">
            {`${t("editProfileForm.postCode")}`}
          </label>
          <input
            id="postal_code"
            type="text"
            placeholder={`${t("editProfileForm.postalCodePlaceholder")}`}
            {...register("postal_code", {
              // required: `${t("editProfileForm.postalCodeRequired")}`,
              pattern: {
                value: /^[0-9]{7}$/, // Matches exactly 7 numeric digits
                message: `${t("editProfileForm.postalCodeError")}`,
              },
            })}
            className={inputClass}
            onChange={(e) => handlePostalCodeChange(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className={labelClass} htmlFor="prefecture">
            {`${t("editProfileForm.prefecture")}`}
          </label>
          <input
            id="prefecture"
            type="text"
            className={`${inputClass} pr-8`}
            {...register("prefecture")}
          />
        </div>
        <div className="mb-6">
          <label className={labelClass} htmlFor="city_ward">
            {`${t("editProfileForm.cityWard")}`}
          </label>
          <input
            id="city_ward"
            type="text"
            {...register("city_ward")}
            className={inputClass}
          />
        </div>
        */}

        {/* Postal Code */}
        <div className="mb-6">
          <label className={labelClass} htmlFor="postal_code">
            {`${t("editProfileForm.postCode")}`}
          </label>
          <input
            id="postal_code"
            type="text"
            placeholder={`${t("editProfileForm.postalCodePlaceholder")}`}
            {...register("postal_code")}
            className={inputClass}
          />
        </div>

        {/* Prefecture Selection */}
        <div className="mb-6">
          <label className={labelClass} htmlFor="prefecture">
            {`${t("searchBar.prefecture")}`}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="prefecture"
            list="prefecture-options"
            {...register("prefecture", {
              required: t("editProfileForm.requiredPrefecture"),
            })}
            onChange={handlePrefectureChange}
            placeholder={t("searchBar.selectPrefecture")}
            className={inputClass}
          />
          <datalist id="prefecture-options">
            {prefectureOptions.map((pref) => (
              <option key={pref} value={t(`searchBar.prefectureOptions.${pref}`)}>
                {t(`searchBar.prefectureOptions.${pref}`)}
              </option>
            ))}
          </datalist>
          {errors.prefecture && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.prefecture.message}
            </p>
          )}
        </div>

        {/* City Selection */}
        <div className="mb-6 relative searchable-list">
          <label className={labelClass} htmlFor="city">
            {`${t("searchBar.cityWard")}`}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            id="city"
            list="city-options"
            {...register("city_ward", {
              required: t("editProfileForm.requiredCityWard"),
            })}
            placeholder={t("searchBar.enterCityWard")}
            className={inputClass}
          />
          <datalist id="city-options">
            {(cityOptions[selectedPrefecture] || cityOptions[prefectures[selectedPrefecture]] || []).map((city) => (
              <option key={city} value={t(`searchBar.cityOptions.${prefectures[selectedPrefecture] || selectedPrefecture}.${city}`)}>
                {t(`searchBar.cityOptions.${prefectures[selectedPrefecture] || selectedPrefecture}.${city}`)}
              </option>
            ))}
          </datalist>
          {errors.city_ward && (
            <p className="text-red-500 text-xs italic mt-1">
              {errors.city_ward.message}
            </p>
          )}
        </div>

        {/* Street */}
        <div className="mb-8">
          <label className={labelClass} htmlFor="street">
            {`${t("editProfileForm.houseAndStreet")}`}
          </label>
          <input
            id="street"
            type="text"
            {...register("street_address")}
            className={inputClass}
          />
        </div>
        <div className="mb-2">
          {/* Languages */}
          <p className={`${labelClass} mb-4`}>{`${t(
            "editProfileForm.languages"
          )}`}</p>
          <div className="flex justify-center gap-4">
            {/* Japanese Checkbox */}
            <div className="flex flex-col items-center">
              <input
                id="japanese_ok"
                type="checkbox"
                {...register("japanese_ok")}
                className="absolute opacity-0 peer"
              />
              <label htmlFor="japanese_ok" className={checkboxLabelClass}>
                <Japan className="w-20 h-20 text-blue-700" />
              </label>
            </div>

            {/* English Checkbox */}
            <div className="flex flex-col items-center">
              <input
                id="english_ok"
                type="checkbox"
                {...register("english_ok")}
                className="absolute opacity-0 peer"
              />
              <label htmlFor="english_ok" className={checkboxLabelClass}>
                <UnionJack className="w-20 h-20 text-blue-700" />
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-center md:justify-end">
          {" "}
          <button
            type="submit"
            className="shadow btn-primary focus:shadow-outline focus:outline-none font-bold py-2 px-4 text-sm rounded w-full sm:w-auto sm:mr-4 md:mr-6 md:w-48 md:py-3 md:px-8 mt-6"
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
