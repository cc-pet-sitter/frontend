import { AppUser } from "../../types/userProfile.ts";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Done } from "@mui/icons-material";
import { GiSniffingDog } from "react-icons/gi";

type SearchResultsProps = {
  appUsers: AppUser[];
};

const SearchResults: React.FC<SearchResultsProps> = ({ appUsers }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  console.log(appUsers, "AppUsers");

  if (!appUsers.length) {
    return (
      <div className="p-6">
        <div className="bg-gray-100 rounded-md shadow py-8">
          <div className="flex justify-center items-center">
            <GiSniffingDog size={"4em"} />
          </div>
          <p className="text-center text-xl font-semibold p-8">
            {t("searchPage.noResultsFound")}
          </p>
        </div>
      </div>
    );
  }

  console.log("Results", appUsers);

  const goToNewPage = (userId: number) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="flex flex-col justify-center px-4 sm:px-6 lg:px-8 ">
      <ul className="w-full max-w-4xl">
        {appUsers.map((ele) => (
          <div key={ele.sitter.id} className="pb-6">
            <div className="relative flex flex-col rounded-lg border border-slate-200 bg-white shadow-sm sm:flex-row sm:gap-6">
              <nav className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:p-6">
                {/* Image */}
                <div className="mr-0 mb-4 grid place-items-center sm:mr-6 sm:mb-0">
                  <img
                    alt="Petter Sitter Image"
                    src={ele.appuser.profile_picture_src}
                    className="h-32 w-32 rounded-full object-cover object-center sm:h-32 sm:w-32"
                  />
                </div>
                {/* Content */}
                <div>
                  <h6 className="text-slate-800 font-medium text-base sm:text-lg">
                    {ele.sitter.sitter_profile_bio}
                  </h6>
                  <p className="text-slate-500 text-sm sm:text-base">
                    {ele.sitter?.visit_ok ||
                    ele.sitter?.sitter_house_ok ||
                    ele.sitter?.owner_house_ok ? (
                      <>
                        {t("searchPage.available")}{" "}
                        {(() => {
                          const services = [
                            ele.sitter.sitter_house_ok &&
                              t("searchPage.sitter_house"),
                            ele.sitter.owner_house_ok &&
                              t("searchPage.owner_house"),
                            ele.sitter.visit_ok && t("searchPage.visits"),
                          ].filter(Boolean);

                          return services.length > 1
                            ? services.slice(0, -1).join(", ") +
                                " and " +
                                services.slice(-1)
                            : services[0];
                        })()}
                        .
                      </>
                    ) : (
                      t("searchPage.notAvailable")
                    )}
                  </p>

                  <div className="pt-4 pb-4">
                    <p className="text-slate-500 text-sm">
                      {ele.sitter.dogs_ok ? (
                        <>
                          <Done /> {t("searchPage.dog")}
                        </>
                      ) : (
                        <>{/* <NotInterested /> {t("searchPage.dog")} */}</>
                      )}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {ele.sitter.cats_ok ? (
                        <>
                          <Done /> {t("searchPage.cat")}
                        </>
                      ) : (
                        <>{/* <NotInterested /> {t("searchPage.cat")} */}</>
                      )}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {ele.sitter.fish_ok ? (
                        <>
                          <Done /> {t("searchPage.fish")}
                        </>
                      ) : (
                        <>{/* <NotInterested /> {t("searchPage.fish")} */}</>
                      )}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {ele.sitter.birds_ok ? (
                        <>
                          <Done /> {t("searchPage.bird")}
                        </>
                      ) : (
                        <>{/* <NotInterested /> {t("searchPage.bird")} */}</>
                      )}
                    </p>
                    <p className="text-slate-500 text-sm">
                      {ele.sitter.rabbits_ok ? (
                        <>
                          <Done /> {t("searchPage.rabbit")}
                        </>
                      ) : (
                        <>{/* <NotInterested /> {t("searchPage.rabbit")} */}</>
                      )}
                    </p>
                  </div>
                  <div>
                    <button
                      className="shadow btn-primary focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded w-full sm:w-auto"
                      onClick={() => goToNewPage(ele.sitter.appuser_id)}
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
