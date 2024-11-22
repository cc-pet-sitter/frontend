import { useForm } from "react-hook-form";

const SignUpForm: React.FC = () => {
  const { register, handleSubmit } = useForm({
    shouldUseNativeValidation: true,
  });

  const onSubmit = async (data: unknown) => {
    console.log(data);
  };

  // Shared styles
  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white";
  const labelClass =
    "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";

  const prefectureOptions = ["Tokyo", "Saitama", "Chiba"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
      <div className="flex flex-wrap -mx-3 mb-6">
        {/* First Name */}
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className={labelClass} htmlFor="firstName">
            First Name:
          </label>
          <input
            id="firstName"
            type="text"
            placeholder="Ken"
            {...register("firstName", {
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
            placeholder="Tanaka"
            {...register("lastName", {
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
            type="text"
            placeholder="kentanaka@dogmail.com"
            {...register("email", {
              required: "Please enter your email.",
            })}
            className={inputClass}
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
            placeholder="000-0000"
            {...register("postcode", {
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
            placeholder="Tokyo"
            {...register("city", {
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
            id="Street"
            type="text"
            placeholder="1 Doggy Avenue"
            {...register("street", {
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
          <input type="checkbox" {...register("japaneseOk")} className="mr-2" />
        </label>
        <label className={`${labelClass} flex items-center`}>
          English:
          <input type="checkbox" {...register("englishOk")} className="mr-2" />
        </label>
      </div>

      <div className="md:flex md:items-center">
        <div className="md:w-2/3">
          <button
            type="submit"
            className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignUpForm;
