// /// NOT USED RIGHT NOW?? DELETE?

// import { useForm } from "react-hook-form";
// import { useAuth } from "../../contexts/AuthContext";
// import ProfilePictureUploader from "../services/ProfilePictureUploader";
// import { useState } from "react";

// type Props = {
//   closeEditForm: () => void;
// };

// const SignUpForm: React.FC<Props> = ({ closeEditForm }) => {
//   const [profilePicture, setProfilePicture] = useState<string | null>(null);
//   const { register, handleSubmit } = useForm({
//     shouldUseNativeValidation: true,
//   });
//   const { currentUser, userInfo, setUserInfo} = useAuth();

//   const handleUpload = async (url: string) => {
//     setProfilePicture(url);

//     const idToken = await currentUser?.getIdToken();
//     const backendURL =
//       import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
//     const response = await fetch(`${backendURL}/appuser/${userInfo?.id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${idToken}`,
//       },
//       body: JSON.stringify({
//         id: userInfo?.id,
//         profile_picture_src: url,
//       }),
//     });

//     if (!response.ok) {
//       const data = await response.json();
//       throw new Error(data.detail || "Failed to save user profile picture.");
//     }

//     const updatedUser = await response.json();
//     setUserInfo(updatedUser);
//   };

//   const onSubmit = async (data: unknown) => {
//     console.log(data);

//   };

//   // Shared styles
//   const inputClass =
//     "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white";
//   const labelClass =
//     "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";

//   const prefectureOptions = ["Tokyo", "Saitama", "Chiba"];

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
//       <div className="flex flex-wrap -mx-3 mb-6">
        
//         {/* Profile Picture */}
//         <div className="flex flex-col sm:flex-row items-center p-6">
//           <img
//             src={
//               userInfo?.profile_picture_src ||
//               profilePicture ||
//               "https://firebasestorage.googleapis.com/v0/b/petsitter-84e85.firebasestorage.app/o/user_profile_pictures%2Fdefault-profile.svg?alt=media&token=aa84dc5e-41e5-4f6a-b966-6a1953b25971"
//             }
//             alt={`${userInfo?.firstname} ${userInfo?.lastname}`}
//             className="h-48 w-48 rounded-full object-cover"
//           />
//           <ProfilePictureUploader
//             id={userInfo?.id}
//             pictureType="user_profile_pictures"
//             onUpload={handleUpload}
//           />
//         </div>

//         {/* First Name */}
//         <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//           <label className={labelClass} htmlFor="firstName">
//             First Name:
//           </label>
//           <input
//             id="firstName"
//             type="text"
//             placeholder={userInfo?.firstname || "Ken"}
//             {...register("firstName", {
//               required: "Please enter your first name.",
//             })}
//             className={inputClass}
//           />
//         </div>

//         {/* Last Name */}
//         <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//           <label className={labelClass} htmlFor="lastName">
//             Last Name:
//           </label>
//           <input
//             id="lastName"
//             type="text"
//             placeholder={userInfo?.lastname || "Tanaka"}
//             {...register("lastName", {
//               required: "Please enter your last name.",
//             })}
//             className={inputClass}
//           />
//         </div>
      
//         {/* Email */}
//         <div className="w-full px-3 mb-6 md:mb-0">
//           <label className={labelClass} htmlFor="email">
//             Email:
//           </label>
//           <input
//             id="email"
//             type="text"
//             placeholder={userInfo?.email || "kentanaka@dogmail.com"}
//             {...register("email", {
//               required: "Please enter your email.",
//             })}
//             className={inputClass}
//           />
//         </div>

//         {/* Postcode */}
//         <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//           <label className={labelClass} htmlFor="postcode">
//             Postcode:
//           </label>
//           <input
//             id="postcode"
//             type="text"
//             placeholder={userInfo?.postal_code || "000-0000"}
//             {...register("postcode", {
//               required: "Please enter your postcode.",
//             })}
//             className={inputClass}
//           />
//         </div>

//         {/* Prefecture */}
//         <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//           <label className={labelClass} htmlFor="prefecture">
//             Prefecture:
//           </label>
//           <select
//             id="prefecture"
//             {...register("prefecture", {
//               required: "Please select a prefecture.",
//             })}
//             className={`${inputClass} pr-8`}
//           >
//             {prefectureOptions.map((pref) => (
//               <option key={pref} value={pref}>
//                 {pref}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* City */}
//         <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//           <label className={labelClass} htmlFor="city">
//             City:
//           </label>
//           <input
//             id="city"
//             type="text"
//             placeholder={userInfo?.city_ward || "Tokyo"}
//             {...register("city", {
//               required: "Please enter a city.",
//             })}
//             className={inputClass}
//           />
//         </div>

//         {/* Street */}
//         <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
//           <label className={labelClass} htmlFor="street">
//             House No. and Street:
//           </label>
//           <input
//             id="Street"
//             type="text"
//             placeholder={userInfo?.street_address || "1 Doggy Avenue"}
//             {...register("street", {
//               required: "Please enter a street.",
//             })}
//             className={inputClass}
//           />
//         </div>
//       </div>

//       {/* Languages */}
//       <div className="mb-6">
//         <p className={`${labelClass} mb-3`}>Languages:</p>
//         <label className={`${labelClass} flex items-center`}>
//           Japanese:
//           <input type="checkbox" {...register("japaneseOk")} className="mr-2" />
//         </label>
//         <label className={`${labelClass} flex items-center`}>
//           English:
//           <input type="checkbox" {...register("englishOk")} className="mr-2" />
//         </label>
//       </div>

//       {/* Save Button */}
//       <div className="md:flex md:items-center">
//         <div className="md:w-2/3">
//           <button
//             type="submit"
//             className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
//             onClick={closeEditForm}
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default SignUpForm;
