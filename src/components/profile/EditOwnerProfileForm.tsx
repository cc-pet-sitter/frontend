// // ATENTION Duplicate from EditSitterProfileForm.tsx for test purposes

// import { useForm } from "react-hook-form";

// const EditOwnerProfileForm: React.FC = () => {
//   const { register, handleSubmit } = useForm({
//     shouldUseNativeValidation: false,
//   });

//   const onSubmit = async (data: unknown) => {
//     console.log(data);
//   };

//   // Shared styles
//   const inputClass =
//     "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white";
//   const labelClass =
//     "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";

//   const petOptions = ["Dog", "Cat", "Fish", "Bird", "Rabbit"];
//   const serviceOptions = ["Boarding", "Stay in", "Drop in"];

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
//       <div className="mb-6">
//         <label className={`${labelClass} flex items-center`}>
//           Introduction Profile:
//           <textarea
//             className={inputClass}
//             rows={4}
//             cols={40}
//             {...register("pet_sitter_bio")}
//           />
//         </label>
//       </div>
//       <div className="mb-6">
//         {/* Pets */}
//         <p className={`${labelClass} mb-3`}>Pets you can sit:</p>
//         {petOptions.map((pet) => (
//           <label key={pet} className={`${labelClass} flex items-center`}>
//             <input
//               type="checkbox"
//               {...register("pets")}
//               value={pet.toLowerCase()}
//               className="mr-2"
//             />
//             {pet}
//           </label>
//         ))}
//       </div>
//       <div className="mb-6">
//         {/* Types of Service You Offer */}
//         <p className={`${labelClass} mb-3`}>Types of Service You Offer:</p>
//         {serviceOptions.map((service) => (
//           <label key={service} className={`${labelClass} flex items-center`}>
//             <input
//               type="checkbox"
//               {...register("types_of_service")}
//               value={service.toLowerCase()}
//               className="mr-2"
//             />
//             {service}
//           </label>
//         ))}
//       </div>

//       <div className="md:flex md:items-center">
//         <div className="md:w-2/3">
//           <button
//             type="submit"
//             className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </form>
//   );
// };

// export default EditOwnerProfileForm;
