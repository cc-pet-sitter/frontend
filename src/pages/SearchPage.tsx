import { useLocation } from "react-router-dom";
import { SearchFormData } from "../components/search/SearchBar";
import SearchBar from "../components/search/SearchBar";
import SearchResults from "../components/search/SearchResults";
import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TestMap from "../components/maps/TestMap";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const SearchPage: React.FC = () => {
  const location = useLocation();
  const initialResults = location.state?.searchResults || [];
  const initialSearch = location.state?.initialSearch || {};

  const [searchResults, setSearchResults] = useState(initialResults);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [initialFormData, setInitialFormData] =
    useState<SearchFormData>(initialSearch);

  const { t } = useTranslation();

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
      setSearchResults([...data]);
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
      <div>
        <TestMap></TestMap>
      </div>
      <div className="mt-4 ml-auto flex flex-col items-center pb-4">
        <button
          onClick={() => setShowSearchBar((prev: boolean) => !prev)}
          className="btn-secondary py-1 px-3 text-sm"
        >
          {showSearchBar ? (
            <>
              <CloseIcon className="mr-1" />
              {t("sitterProfilePage.close")}
            </>
          ) : (
            <>
              <FilterAltIcon className="mr-1" />
              {t("searchPage.refineSearch")}
            </>
          )}
        </button>
        {showSearchBar && (
          <div className="w-full sm:w-auto sm:mt-1 sm:mb-1 sm:py-1 ">
            <SearchBar
              onSearchSubmit={handleSecondSearchSubmit}
              closeSearchBar={handleCloseSearchBar}
              initialData={initialFormData}
            />
          </div>
        )}
      </div>

      <SearchResults appUsers={searchResults} />
    </div>
  );
};

export default SearchPage;
