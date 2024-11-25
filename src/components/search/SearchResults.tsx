import { useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { AppUser } from "../../types/userProfile.ts";
import { appUsers } from "../../dummyusers/dummyData";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

type SearchResultsProps = {
  appUsers: AppUser[];
};

const SearchResults: React.FC<SearchResultsProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const searchQuery = useMemo(
    () => location.state?.searchQuery || {},
    [location.state]
  );

  console.log("SQ", searchQuery);
  console.log(appUsers[0]);

  const [filteredData, setFilteredData] = useState<AppUser[]>([]);

  useEffect(() => {
    if (!searchQuery || !appUsers.length) return;

    const filtered = appUsers.filter((user) => {
      //   const matchesPostcode = searchQuery.postcode
      //     ? user.postal_code.startsWith(searchQuery.postcode)
      //     : true;
      const matchesPrefecture = searchQuery.prefecture
        ? user.prefecture.toLowerCase() === searchQuery.prefecture.toLowerCase()
        : true;
      //   const matchesCityWard = searchQuery.cityWard
      //     ? user.city_ward
      //         .toLowerCase()
      //         .includes(searchQuery.cityWard.toLowerCase())
      //     : true;
      //   const matchesPets = searchQuery.pets
      //     ? searchQuery.pets.every(
      //         (pet: string) => user.sitter_profile[`${pet}_ok`]
      //       )
      //     : true;
      //   const matchesService = searchQuery.typesOfService
      //     ? searchQuery.typesOfService.some(
      //         (service: string) => user.sitter_profile[`${service}_ok`]
      //       )
      //     : true;

      return (
        // matchesPostcode &&
        matchesPrefecture
        // matchesCityWard
        // matchesPets &&
        // matchesService
      );
    });

    setFilteredData(filtered);
  }, [searchQuery]);

  const goToNewPage = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="flex justify-center px-4 sm:px-6 lg:px-8">
      <ul className="w-full max-w-4xl">
        {filteredData.map((ele) => (
          <div key={ele.id} className="pb-6">
            <div className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm sm:flex-row sm:gap-6">
              <nav className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:p-6">
                {/* Image */}
                <div className="mr-0 mb-4 grid place-items-center sm:mr-6 sm:mb-0">
                  <img
                    alt="Petter Sitter Image"
                    src={ele.sitter_profile.bio_picture_src_list}
                    className="h-32 w-32 rounded-full object-cover object-center sm:h-32 sm:w-32"
                  />
                </div>
                {/* Content */}
                <div>
                  <h6 className="text-slate-800 font-medium text-base sm:text-lg">
                    {ele.sitter_profile.profile_bio}
                  </h6>
                  <p className="text-slate-500 text-sm sm:text-base">
                    {ele.sitter_profile.visit_ok
                      ? t("searchPage.available")
                      : t("searchPage.notAvailable")}
                  </p>
                  <div className="pt-4 pb-4">
                    <p className="text-slate-500 text-sm">
                      {ele.sitter_profile.dogs_ok
                        ? `✅ ${t("searchPage.dog")}`
                        : `❌ ${t("searchPage.dog")}`}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {ele.sitter_profile.cats_ok
                        ? `✅ ${t("searchPage.cat")}`
                        : `✅ ${t("searchPage.cat")}`}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {ele.sitter_profile.fish_ok
                        ? `✅ ${t("searchPage.fish")}`
                        : `✅ ${t("searchPage.fish")}`}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {ele.sitter_profile.birds_ok
                        ? `✅ ${t("searchPage.fish")}`
                        : `✅ ${t("searchPage.fish")}`}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {ele.sitter_profile.rabbits_ok
                        ? `✅ ${t("searchPage.rabbit")}`
                        : `✅ ${t("searchPage.rabbit")}`}
                    </p>
                  </div>
                  <div>
                    <button
                      className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
                      onClick={() => goToNewPage(ele.id)}
                    >
                      {t("searchPage.viewProfile")}
                    </button>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default SearchResults;
