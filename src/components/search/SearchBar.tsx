import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { LuDog, LuFish, LuSchool } from "react-icons/lu";
import { TbHomeFilled, TbHomeMove } from "react-icons/tb";
import { PiRabbitBold, PiCatBold, PiBirdBold } from "react-icons/pi";

export interface SearchFormData {
  postcode?: string;
  prefecture?: string;
  city_ward?: string;
  // pets?: string[];
  dogs_ok: boolean;
  cats_ok: boolean;
  fish_ok: boolean;
  birds_ok: boolean;
  rabbits_ok: boolean;
  // types_of_service?: boolean;
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
  const { register, handleSubmit } = useForm<SearchFormData>();

  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white";
  const labelClass =
    "block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2";

  // const petOptions = ["dog", "cat", "fish", "bird", "rabbit"];
  // const serviceOptions = ["boarding", "stayIn", "dropIn"];

  const prefectureOptions = [
    "Hokkaido",
    "Aomori",
    "Iwate",
    "Miyagi",
    "Akita",
    "Yamagata",
    "Fukushima",
    "Ibaraki",
    "Tochigi",
    "Gunma",
    "Saitama",
    "Chiba",
    "Tokyo",
    "Kanagawa",
    "Niigata",
    "Toyama",
    "Ishikawa",
    "Fukui",
    "Yamanashi",
    "Nagano",
    "Gifu",
    "Shizuoka",
    "Aichi",
    "Mie",
    "Shiga",
    "Kyoto",
    "Osaka",
    "Hyogo",
    "Nara",
    "Wakayama",
    "Tottori",
    "Shimane",
    "Okayama",
    "Hiroshima",
    "Yamaguchi",
    "Tokushima",
    "Kagawa",
    "Ehime",
    "Kochi",
    "Fukuoka",
    "Saga",
    "Nagasaki",
    "Kumamoto",
    "Oita",
    "Miyazaki",
    "Kagoshima",
    "Okinawa",
  ];
  return (
    <div className="flex justify-center p-8 ">
      <form
        onSubmit={handleSubmit(onSearchSubmit)}
        className="w-full max-w-lg "
      >
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className={labelClass} htmlFor="prefecture">
              {t("searchBar.prefecture")}
            </label>
            <select
              id="prefecture"
              {...register("prefecture", {
                required: t("searchBar.selectPrefecture"),
              })}
              className={`${inputClass} pr-8`}
            >
              <option value="">{t("searchBar.selectPrefecture")}</option>
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
              placeholder={t("searchBar.enterCityWard")}
              {...register("city_ward")}
              className={inputClass}
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6 ">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {/* Your Pet */}
            <p className={`${labelClass} mb-3`}>{t("searchBar.yourPet")}:</p>

            <ul className="grid grid-cols-2 gap-6 md:grid-cols-2">
              <li>
                <input
                  type="checkbox"
                  id="dog"
                  value=""
                  className="hidden peer"
                  {...register("dogs_ok")}
                />
                <label
                  htmlFor="dog"
                  className="flex flex-col items-center justify-center w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex flex-col items-center">
                    <LuDog size="3em" />
                    <div className="w-full text-lg text-center font-semibold">
                      {t("searchBar.petOptions.dog")}
                    </div>
                  </div>
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="cat"
                  value=""
                  className="hidden peer"
                  {...register("cats_ok")}
                />
                <label
                  htmlFor="cat"
                  className="flex flex-col items-center justify-center w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex flex-col items-center">
                    <PiCatBold size="3em" />
                    <div className="w-full text-lg text-center font-semibold justify-center">
                      {t("searchBar.petOptions.cat")}
                    </div>
                  </div>
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="fish"
                  value=""
                  className="hidden peer"
                  {...register("fish_ok")}
                />
                <label
                  htmlFor="fish"
                  className="flex flex-col items-center justify-center w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex flex-col items-center">
                    <LuFish size="3em" />
                    <div className="w-full text-lg text-center font-semibold">
                      {t("searchBar.petOptions.fish")}
                    </div>
                  </div>
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="bird"
                  value=""
                  className="hidden peer"
                  {...register("birds_ok")}
                />
                <label
                  htmlFor="bird"
                  className="flex flex-col items-center justify-center w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex flex-col items-center">
                    <PiBirdBold size="3em" />
                    <div className="w-full text-lg text-center font-semibold">
                      {t("searchBar.petOptions.bird")}
                    </div>
                  </div>
                </label>
              </li>
              <li>
                <input
                  type="checkbox"
                  id="rabbit"
                  value=""
                  className="hidden peer"
                  {...register("rabbits_ok")}
                />
                <label
                  htmlFor="rabbit"
                  className="flex flex-col items-center justify-center w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex flex-col items-center">
                    <PiRabbitBold size="3em" />
                    <div className="w-full text-lg text-center font-semibold">
                      {t("searchBar.petOptions.rabbit")}
                    </div>
                  </div>
                </label>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            {/* Type Of Service */}
            <p className={`${labelClass} mb-3`}>
              {t("searchBar.typeOfService")}:
            </p>

            <ul className="grid grid-cols-2 gap-6 md:grid-cols-2">
              <li className="flex justify-center ">
                <input
                  type="checkbox"
                  id="boarding"
                  value=""
                  className="hidden peer"
                  {...register("sitter_house_ok")}
                />
                <label
                  htmlFor="boarding"
                  className="flex flex-col items-center justify-center w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex flex-col items-center">
                    <LuSchool
                      className="inline-flex justify-center"
                      size="3em"
                    />
                    <div className="w-full text-lg text-center font-semibold">
                      {t("searchBar.serviceOptions.boarding")}
                    </div>
                  </div>
                </label>
              </li>
              <li className="flex justify-center">
                <input
                  type="checkbox"
                  id="stayIn"
                  value=""
                  className="hidden peer"
                  {...register("owner_house_ok")}
                />
                <label
                  htmlFor="stayIn"
                  className="flex flex-col items-center justify-center w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex flex-col items-center">
                    <TbHomeFilled size="3em" />
                    <div className="w-full text-lg text-center font-semibold">
                      {t("searchBar.serviceOptions.stayIn")}
                    </div>
                  </div>
                </label>
              </li>
              <li className="flex justify-center ">
                <input
                  type="checkbox"
                  id="visit"
                  value=""
                  className="hidden peer"
                  {...register("visit_ok")}
                />
                <label
                  htmlFor="visit"
                  className="flex flex-col items-center justify-center w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  <div className="flex flex-col items-center">
                    <TbHomeMove size="3em" />
                    <div className="w-full text-lg text-center font-semibold">
                      {t("searchBar.serviceOptions.dropIn")}
                    </div>
                  </div>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div className="md:flex md:items-center">
          <div className="md:w-1/2 flex justify-center ">
            <button type="submit" className="btn-primary w-full">
              {t("searchBar.search")}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
