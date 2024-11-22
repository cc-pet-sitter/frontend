import { useForm } from "react-hook-form";

const SearchBar: React.FC = () => {
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

  const petOptions = ["Dog", "Cat", "Fish", "Bird", "Rabbit"];
  const serviceOptions = ["Boarding", "Stay in", "Drop in"];
  const prefectureOptions = ["Tokyo", "Saitama", "Chiba"];

  return (
    <div className="p-8   ">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg ">
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
          <div className="w-full px-3 mb-6 md:mb-0">
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
        </div>
        {/* <div className="flex flex-wrap -mx-3 mb-6 ">
        
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={labelClass} htmlFor="startDate">
              Start Date:
            </label>
            <input
              id="startDate"
              type="text"
              placeholder="2024/08/02"
              {...register("startDate", {
                required: "Please enter an start date.",
              })}
              className={inputClass}
            />
          </div>
        
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={labelClass} htmlFor="endDate">
              End Date:
            </label>
            <input
              id="endDate"
              type="text"
              placeholder="2024/08/10"
              {...register("endDate", {
                required: "Please enter an end date.",
              })}
              className={inputClass}
            />
          </div>
        </div> */}
        <div className="flex flex-wrap -mx-3 mb-6 ">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {/* Your Pet */}
            <p className={`${labelClass} mb-3`}>Your Pet:</p>
            {petOptions.map((pet) => (
              <label key={pet} className={`${labelClass} flex items-center`}>
                <input
                  type="checkbox"
                  {...register("pets")}
                  value={pet.toLowerCase()}
                  className="mr-2"
                />
                {pet}
              </label>
            ))}
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {/* Type of Service You're Looking For */}
            <p className={`${labelClass} mb-3`}>
              Type of Service You're Looking For:
            </p>
            {serviceOptions.map((service) => (
              <label
                key={service}
                className={`${labelClass} flex items-center`}
              >
                <input
                  type="checkbox"
                  {...register("typesOfService")}
                  value={service.toLowerCase()}
                  className="mr-2"
                />
                {service}
              </label>
            ))}
          </div>
        </div>

        <div className="md:flex md:items-center">
          <div className="md:w-2/3">
            <button
              type="submit"
              className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
