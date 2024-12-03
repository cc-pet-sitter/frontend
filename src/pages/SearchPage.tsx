import { useLocation } from "react-router-dom";
import { SearchFormData } from "../components/search/SearchBar";
import SearchBar from "../components/search/SearchBar";
import SearchResults from "../components/search/SearchResults";
import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaSearch } from "react-icons/fa";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const SearchPage: React.FC = () => {
  const location = useLocation();
  const initialResults = location.state?.searchResults || [];
  const [searchResults, setSearchResults] = useState(initialResults);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

  const { t } = useTranslation();

  const handleSecondSearchSubmit = async (formData: SearchFormData) => {
    try {
      const queryParams = new URLSearchParams(
        formData as unknown as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `${apiURL}/appuser-sitters?${queryParams}`
      );
      console.log("API Response Data:", data);

      // Ensure a new reference
      setSearchResults([...data]);
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
      <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col items-center pb-4">
        <button
          onClick={() => setShowSearchBar((prev: boolean) => !prev)}
          className="btn-secondary"
        >
          {showSearchBar ? (
            t("sitterProfilePage.close")
          ) : (
            <FaSearch size={"1.55em"} />
          )}
        </button>
        {showSearchBar && (
          <div className="mt-6 w-full sm:w-auto">
            <SearchBar
              onSearchSubmit={handleSecondSearchSubmit}
              closeSearchBar={handleCloseSearchBar}
            />
          </div>
        )}
      </div>
      <SearchResults appUsers={searchResults} />
    </div>
  );
};

export default SearchPage;
