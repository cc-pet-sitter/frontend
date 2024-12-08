import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuDog, LuFish, LuSchool } from "react-icons/lu";
import { TbHomeFilled, TbHomeMove } from "react-icons/tb";
import { PiRabbitBold, PiCatBold, PiBirdBold } from "react-icons/pi";
// import { prefectureOptions } from "../../options/Prefectures";
import { cityOptions } from "../../options/Cities";
import { useState } from "react";

export interface SearchFormData {
  postcode?: string;
  prefecture?: string;
  city_ward?: string;
  dogs_ok: boolean;
  cats_ok: boolean;
  fish_ok: boolean;
  birds_ok: boolean;
  rabbits_ok: boolean;
  sitter_house_ok: boolean;
  owner_house_ok: boolean;
  visit_ok: boolean;
}

interface SearchBarProps {
  onSearchSubmit: (data: SearchFormData) => void;
  closeSearchBar: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearchSubmit }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SearchFormData>();
  const [selectedPrefecture, setSelectedPrefecture] = useState("");

  const prefectureOptions = Object.keys(cityOptions);

  const handlePrefectureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.value;
    setSelectedPrefecture(selected);

    setValue("prefecture", selected as string);
  };

  const inputClass =
    "appearance-none block w-full bg-white text-gray-700 text-sm md:text-base border border-gray-400 rounded-md py-2 px-4 leading-tight focus:outline-none focus:bg-white focus:ring-[#D87607] focus:border-[#D87607]";
  const labelClass =
    "block text-sm md:text-base font-medium text-gray-700 mb-2";
  const checkboxLabelClass =
    "flex flex-col items-center justify-center px-3 py-2 md:py-3 text-gray-500 text-sm md:text-base bg-white border-2 border- border-gray-300 rounded-lg cursor-pointer hover:border-[#D87607]/60 peer-checked:border-[#D87607] peer-checked:bg-white";

  return (
    <div className="flex justify-center p-2 mx-4 my-6 md:my-14 rounded-lg md:w-[60rem] shadow-custom">
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="bg-white p-6 md:w-[55rem]"
      >
        <div className="flex flex-wrap -mx-3 mb-4">
          {/* Prefecture Selection */}
          <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
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
                <option key={pref} value={pref}>
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
          <div className="w-full md:w-1/2 px-3 relative searchable-list">
            <label className={labelClass} htmlFor="city">
              {`${t("searchBar.cityWard")}`}
            </label>
            <input
              id="city"
              list="city-options"
              {...register("city_ward")}
              placeholder={t("searchBar.enterCityWard")}
              className={inputClass}
            />
            <datalist id="city-options">
              {(cityOptions[selectedPrefecture] || []).map((city) => (
                <option key={city} value={city}>
                  {t(`searchBar.cityOptions.${selectedPrefecture}.${city}`)}
                </option>
              ))}
            </datalist>
          </div>
        </div>

        {/* Pet Options */}
        <div className="mb-6">
          <p className={labelClass}>{t("searchBar.yourPet")}</p>
          <ul className="grid grid-cols-3 gap-4 md:grid-cols-5">
            <li>
              <input
                type="checkbox"
                id="dog"
                className="hidden peer"
                {...register("dogs_ok")}
              />
              <label htmlFor="dog" className={checkboxLabelClass}>
                <LuDog size="1.8em" />
                <span className="mt-1">{t("searchBar.petOptions.dog")}</span>
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                id="cat"
                className="hidden peer"
                {...register("cats_ok")}
              />
              <label htmlFor="cat" className={checkboxLabelClass}>
                <PiCatBold size="1.8em" />
                <span className="mt-1">{t("searchBar.petOptions.cat")}</span>
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                id="fish"
                className="hidden peer"
                {...register("fish_ok")}
              />
              <label htmlFor="fish" className={checkboxLabelClass}>
                <LuFish size="1.8em" />
                <span className="mt-1">{t("searchBar.petOptions.fish")}</span>
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                id="bird"
                className="hidden peer"
                {...register("birds_ok")}
              />
              <label htmlFor="bird" className={checkboxLabelClass}>
                <PiBirdBold size="1.8em" />
                <span className="mt-1">{t("searchBar.petOptions.bird")}</span>
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                id="rabbit"
                className="hidden peer"
                {...register("rabbits_ok")}
              />
              <label htmlFor="rabbit" className={checkboxLabelClass}>
                <PiRabbitBold size="1.8em" />
                <span className="mt-1">{t("searchBar.petOptions.rabbit")}</span>
              </label>
            </li>
          </ul>
        </div>

        {/* Service Options */}
        <div className="mb-6">
          <p className={labelClass}>{t("searchBar.typeOfService")}</p>
          <ul className="grid grid-cols-3 gap-4">
            <li>
              <input
                type="checkbox"
                id="boarding"
                className="hidden peer"
                {...register("sitter_house_ok")}
              />
              <label htmlFor="boarding" className={checkboxLabelClass}>
                <LuSchool size="1.8em" />
                <span className="mt-1">
                  {t("searchBar.serviceOptions.boarding")}
                </span>
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                id="stayIn"
                className="hidden peer"
                {...register("owner_house_ok")}
              />
              <label htmlFor="stayIn" className={checkboxLabelClass}>
                <TbHomeFilled size="1.8em" />
                <span className="mt-1">
                  {t("searchBar.serviceOptions.stayIn")}
                </span>
              </label>
            </li>
            <li>
              <input
                type="checkbox"
                id="visit"
                className="hidden peer"
                {...register("visit_ok")}
              />
              <label htmlFor="visit" className={checkboxLabelClass}>
                <TbHomeMove size="1.8em" />
                <span className="mt-1">
                  {t("searchBar.serviceOptions.dropIn")}
                </span>
              </label>
            </li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button type="submit" className="btn-primary w-full md:w-1/3 md:py-3">
            {t("searchBar.search")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
