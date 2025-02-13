import { useLocation } from "react-router-dom";
import { SearchFormData } from "../components/search/SearchBar";
import SearchBar from "../components/search/SearchBar";
import SearchResults from "../components/search/SearchResults";
import axios from "axios";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { AppuserExtended } from "../types/userProfile";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const SearchPage: React.FC = () => {
  const location = useLocation();
  const initialResults = location.state?.searchResults || [];
  const initialSearch = location.state?.initialSearch || {};

  const { userInfo } = useAuth();
  const [searchResults, setSearchResults] = useState(initialResults);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [initialFormData, setInitialFormData] =
    useState<SearchFormData>(initialSearch);

  const [currentPage, setCurrentPage] = useState(1);
  const sittersPerPage = 8;

  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setShowSearchBar(true);
      } else {
        setShowSearchBar(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSecondSearchSubmit = async (formData: SearchFormData) => {
    try {
      handleCloseSearchBar();
      const queryParams = new URLSearchParams(
        formData as unknown as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `${apiURL}/appuser-sitters?${queryParams}`
      );

      // Ensure a new reference
      let validatedData: AppuserExtended[];

      if (userInfo) { //If the user performing the search is logged in
        validatedData = data.filter((extendedUser: AppuserExtended) => extendedUser.appuser.id !== userInfo.id); // Remove self from the search results
      } else {
        validatedData = [...data];
      }

      setSearchResults(validatedData);
      setInitialFormData(formData);
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Failed to fetch search results. Please try again.");
    }
  };

  const handleCloseSearchBar = () => {
    setShowSearchBar(false);
  };

  return (
    <div>
      <SearchResults
        appUsers={searchResults}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        sittersPerPage={sittersPerPage}
      />
      <div className="flex flex-col items-center gap-4 mt-3 pb-2 pt-2">
        <div>
          <button
            className="px-4 py-2 btn-primary rounded disabled:opacity-50"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <span className="text-lg font-medium px-4 py-2">
            {currentPage} - {Math.ceil(searchResults.length / sittersPerPage)}
          </span>
          <button
            className="px-4 py-2 btn-primary rounded disabled:opacity-50"
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(
                  prev + 1,
                  Math.ceil(searchResults.length / sittersPerPage)
                )
              )
            }
            disabled={
              currentPage === Math.ceil(searchResults.length / sittersPerPage)
            }
          >
            →
          </button>
        </div>
      </div>

      {/* Search Bar Appears on Scroll */}
      {showSearchBar && (
        <div className="mt-3 flex flex-col items-center bg-[#fef6e4]">
          <h2 className="text-2xl font-semibold mt-6">
            {t("searchPage.refine")}
          </h2>
          <SearchBar
            onSearchSubmit={handleSecondSearchSubmit}
            closeSearchBar={() => setShowSearchBar(false)}
            initialData={initialFormData}
          />
        </div>
      )}
    </div>
  );
};

export default SearchPage;
