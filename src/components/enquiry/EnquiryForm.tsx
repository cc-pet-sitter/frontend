import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

const EnquiryForm: React.FC = () => {
  const { register, handleSubmit } = useForm({
    shouldUseNativeValidation: true,
  });

  const onSubmit = async (data: unknown) => {
    console.log(data);
  };

  const { t } = useTranslation();

  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white justify-center";
  const labelClass =
    "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";

  const petOptions = ["dog", "cat", "fish", "bird", "rabbit"];
  const serviceOptions = ["boarding", "stayIn", "dropIn"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg">
      <div className="flex flex-wrap -mx-3 mb-6 ">
        {/* startDate */}
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className={labelClass} htmlFor="startDate">
            {`${t("enquiryForm.startDate")}:`}
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
        {/* End Date */}
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className={labelClass} htmlFor="endDate">
            {`${t("enquiryForm.endDate")}:`}
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
      </div>

      <div className="mb-6">
        {/* Pets */}
        <p className={`${labelClass} mb-3`}>{`${t(
          "enquiryForm.petToLookAfter"
        )}:`}</p>
        {petOptions.map((pet) => (
          <label key={pet} className={`${labelClass} flex items-center`}>
            <input
              type="checkbox"
              {...register("pets")}
              value={pet.toLowerCase()}
              className="mr-2"
            />
            {t(`searchBar.petOptions.${pet}`)}
          </label>
        ))}
      </div>
      <div className="mb-6">
        {/* Types of Service You Offer */}
        <p className={`${labelClass} mb-3`}>{`${t(
          "enquiryForm.desiredService"
        )}:`}</p>
        {serviceOptions.map((service) => (
          <label key={service} className={`${labelClass} flex items-center`}>
            <input
              type="checkbox"
              {...register("types_of_service")}
              value={service.toLowerCase()}
              className="mr-2"
            />
            {t(`searchBar.serviceOptions.${service}`)}
          </label>
        ))}
      </div>
      <div className="mb-6">
        <label className={`${labelClass} flex items-center`}>
          {`${t("enquiryForm.additionalInfo")}:`}
          <textarea
            className={inputClass}
            rows={4}
            cols={40}
            {...register("pet_sitter_bio")}
          />
        </label>
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        >
          {`${t("enquiryForm.submit")}:`}
        </button>
      </div>
    </form>
  );
};

export default EnquiryForm;
