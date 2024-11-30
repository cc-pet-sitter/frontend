import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

export interface SearchFormData {
  postcode?: string;
  prefecture?: string;
  city_ward?: string;
  pets?: string[];
  types_of_service?: boolean;
}

interface SearchBarProps {
  onSearchSubmit: (data: SearchFormData) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchSubmit }) => {
  const { t } = useTranslation();
  const { register, handleSubmit } = useForm<SearchFormData>();

  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white";
  const labelClass =
    "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";

  const petOptions = ["dog", "cat", "fish", "bird", "rabbit"];
  const serviceOptions = ["boarding", "stayIn", "dropIn"];
  const prefectureOptions = ["Saitama", "Chiba", "Tokyo"];

  return (
    <div className="flex justify-center p-8 ">
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="w-full max-w-lg "
      >
        <div className="flex flex-wrap -mx-3 mb-6">
          {/* Postcode */}
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={labelClass} htmlFor="postcode">
              {t("searchBar.postCode")}
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
              {t("searchBar.prefecture")}
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
                  {t(`searchBar.prefectureOptions.${pref}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          {/* City/Ward */}
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className={labelClass} htmlFor="city_ward">
              {t("searchBar.cityWard")}
            </label>
            <input
              id="city_ward"
              type="text"
              placeholder={t("searchBar.shinjuku")}
              {...register("city_ward", {
                required: "Please enter a city.",
              })}
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6 ">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {/* Your Pet */}
            <p className={`${labelClass} mb-3`}>{t("searchBar.yourPet")}:</p>

            {petOptions.map((pet) => (
              <label key={pet} className={`${labelClass} flex items-center`}>
                <input
                  type="checkbox"
                  {...register("pets")}
                  value={pet}
                  className="mr-2"
                />
                {t(`searchBar.petOptions.${pet}`)}
              </label>
            ))}
          </div>

          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {/* Type of Service You're Looking For */}
            <p className={`${labelClass} mb-3`}>
              {t("searchBar.typeOfService")}
            </p>
            {serviceOptions.map((service) => (
              <label
                key={service}
                className={`${labelClass} flex items-center`}
              >
                <input
                  type="checkbox"
                  {...register("types_of_service")}
                  value={service.toLowerCase()}
                  className="mr-2"
                />
                {service}
              </label>
            ))}
          </div>
        </div>

        <div className="md:flex md:items-center">
          <div className="md:w-1/2 flex justify-center">
            <button
              type="submit"
              className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            >
              {t("searchBar.search")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
