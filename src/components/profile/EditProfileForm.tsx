import { useForm } from "react-hook-form";
import { useAuth } from "../../contexts/AuthContext";
import React, { useEffect, useState } from "react";

type Props = {
  closeEditForm: () => void;
};

type EditProfileFormData = {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  post_code: string;
  prefecture: string;
  city_ward: string;
  street_address: string;
  japanese_ok: boolean;
  english_ok: boolean;
  // Add other fields as necessary
};

type UpdateAppuserResponse = {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
  // Include other fields returned by the backend
};

const EditProfileForm: React.FC<Props> = ({ closeEditForm }) => {
  const { register, handleSubmit, reset } = useForm<EditProfileFormData>({
    shouldUseNativeValidation: true,
  });
  const { currentUser, userInfo } = useAuth(); // Assuming authToken is available
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setUserInfo } = useAuth();

  useEffect(() => {
    if (userInfo) {
      reset({
        user_id: userInfo.user_id,
        firstname: userInfo.firstname || "",
        lastname: userInfo.lastname || "",
        email: userInfo.email || "",
        post_code: userInfo.postal_code || "",
        prefecture: userInfo.prefecture || "",
        city_ward: userInfo.city_ward || "",
        street_address: userInfo.street_address || "",
        japanese_ok: userInfo.japanese_ok || false,
        english_ok: userInfo.english_ok || false,
        // Populate other fields as necessary
      });
    }
  }, [userInfo, reset]);

  const onSubmit = async (data: EditProfileFormData) => {
    setIsLoading(true);
    try {
      const backendURL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const idToken = await currentUser?.getIdToken();
      const response = await fetch(
        `${backendURL}/appuser/${userInfo?.user_id}`, // Ensure correct base URL
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`, // Include the auth token
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update profile.");
      }

      const updatedUser: UpdateAppuserResponse = await response.json();
      console.log("Profile updated successfully:", updatedUser);

      setUserInfo({
        status: "ok",
        user_id: updatedUser.user_id,
        email: updatedUser.email,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        is_sitter: null,
        profile_picture_src: null,
        postal_code: data.post_code,
        prefecture: data.prefecture,
        city_ward: data.city_ward,
        street_address: data.street_address,
        japanese_ok: data.japanese_ok,
        english_ok: data.english_ok,
        // Map other fields as necessary
      });

      setSuccess(true);
      setError(null);

      // Close the edit form
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

  // Shared styles
  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white";
  const labelClass =
    "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";

  const prefectureOptions = ["Tokyo", "Saitama", "Chiba"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
      {success && (
        <p className="text-green-500 text-xs italic">
          Profile updated successfully!
        </p>
      )}

      <div className="flex flex-wrap -mx-3 mb-6">
        {/* First Name */}
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className={labelClass} htmlFor="firstName">
            First Name:
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
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className={labelClass} htmlFor="lastName">
            Last Name:
          </label>
          <input
            id="lastName"
            type="text"
            {...register("lastname", {
              required: "Please enter your last name.",
            })}
            className={inputClass}
          />
        </div>
      </div>
      <div className="flex flex-wrap -mx-3 mb-6">
        {/* Email */}
        <div className="w-full px-3 mb-6 md:mb-0">
          <label className={labelClass} htmlFor="email">
            Email:
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
            Postcode:
          </label>
          <input
            id="postcode"
            type="text"
            {...register("post_code", {
              required: "Please enter your postcode.",
            })}
            className={inputClass}
          />
        </div>
        {/* Prefecture */}
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className={labelClass} htmlFor="prefecture">
            Prefecture:
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
            City:
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
            House No. and Street:
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
        <p className={`${labelClass} mb-3`}>Languages:</p>
        <label className={`${labelClass} flex items-center`}>
          Japanese:
          <input
            type="checkbox"
            {...register("japanese_ok")}
            className="mr-2"
          />
        </label>
        <label className={`${labelClass} flex items-center`}>
          English:
          <input type="checkbox" {...register("english_ok")} className="mr-2" />
        </label>
      </div>

      <div className="md:flex md:items-center">
        <div className="md:w-2/3">
          <button
            type="submit"
            className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditProfileForm;
