// // WE ARE NOT USING THIS FOR THE MOMENT
// // I THINK WE DISPLAY SitterProfilePage.tsx WHERE NEEDED

// import React from "react";
// // import { useTranslation } from "react-i18next";
// import { PiCat, PiRabbit, PiBird } from "react-icons/pi";
// // import { LiaBirthdayCakeSolid, LiaWeightSolid } from "react-icons/lia";
// import { MdOutlineArrowBackIos } from "react-icons/md";
// import { LuDog, LuFish } from "react-icons/lu";
// import { AppUser } from "../../types/userProfile";

// type Props = {
//   appUser: AppUser | null;
//   onClose: () => void;
// };

// const PetProfile: React.FC<Props> = ({ appUser, onClose }) => {
//   //   const { t } = useTranslation();

//   return (
//     <div>
//       <button
//         onClick={(e) => {
//           e.preventDefault();
//           onClose();
//         }}
//         className="m-6 flex"
//       >
//         <MdOutlineArrowBackIos className="mr-3" /> <p>Back</p>
//       </button>

//       {appUser?.sitter_id && (
//         <div className="container mx-autos">
//           <div className="bg-white shadow-md rounded-lg overflow-hidden">
//             {/* Profile Header */}
//             <div className="flex flex-col sm:flex-row items-center my-6">
//               <img
//                 src={
//                   appUser.profile_picture_src ||
//                   "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Cat03.jpg/640px-Cat03.jpg"
//                 }
//                 alt={`Sitter ${appUser.firstname}`}
//                 className="h-48 w-48 rounded-full object-cover"
//               />
//               <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
//                 <h1 className="text-2xl font-bold">{appUser.firstname}</h1>
//               </div>
//             </div>

//             {/* Pet Details */}
//             <div className="p-6 border-t">
//               <h2 className="text-lg font-semibold mb-4">
//                 TEST PET DETAILS
//                 {/* {t("PetProfile.about", { name: petProfile.name })} */}
//               </h2>

//               <div className="flex my-3 ">
//                 {appUser.dogs_ok && (
//                   <>
//                     <LuDog className="mr-3 mt-1 text-xl" />
//                   </>
//                 )}
//                 {appUser.cats_ok && (
//                   <>
//                     <PiCat className="mr-3 mt-1 text-xl" />
//                   </>
//                 )}
//                 {appUser.rabbits_ok && (
//                   <>
//                     <PiRabbit className="mr-3 mt-1 text-xl" />
//                   </>
//                 )}
//                 {appUser.birds_ok && (
//                   <>
//                     <PiBird className="mr-3 mt-1 text-xl" />
//                   </>
//                 )}
//                 {appUser.fish_ok && (
//                   <>
//                     <LuFish className="mr-3 mt-1 text-xl" />
//                   </>
//                 )}
//                 {/* {t("PetProfile.typeOfPet", { cat: petProfile.type_of_animal })} */}
//               </div>

//               {/* <div className="flex my-3">
//                 <LiaBirthdayCakeSolid className="mr-3 mt-1 text-xl" />
//                 {t("PetProfile.birthday")}
//                 {new Date(petProfile.birthday).toLocaleDateString("ja-JP")}
//               </div>

//               {petProfile.weight && (
//                 <div className="flex my-3">
//                   <LiaWeightSolid className="mr-3 mt-1 text-xl" />
//                   {t("PetProfile.weight", { weight: petProfile.weight })}
//                 </div>
//               )}
//               {petProfile.subtype && (
//                 <div className="flex my-3">
//                   <PiMedal className="mr-3 mt-1 text-xl" />
//                   {t("PetProfile.breed")}
//                   {petProfile.subtype}
//                 </div>
//               )} */}
//             </div>

//             {/* Care Info */}
//             {/* <div className="p-6 border-t">
//               <h2 className="text-lg font-semibold mb-4">
//                 {t("sitterProfilePage.profileDetails")}
//               </h2>
//               <ul className="list-none space-y-2 text-left">
//                 <li>
//                   <strong>{`${t("PetProfile.allergies")}:`}</strong>{" "}
//                   {petProfile.known_allergies}
//                 </li>
//                 <li>
//                   <strong>{`${t("PetProfile.medications")}:`}</strong>{" "}
//                   {petProfile.medications}
//                 </li>
//                 <li>
//                   <strong>{`${t("PetProfile.specialNeeds")}:`}</strong>{" "}
//                   {petProfile.special_needs}
//                 </li>
//                 <li></li>
//               </ul>
//             </div> */}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PetProfile;
