import SearchBar from "../components/search/SearchBar";
import { useTranslation } from "react-i18next";
import { SearchFormData } from "../components/search/SearchBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import bannerImage from "../../public/image.png";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSearchSubmit = async (formData: SearchFormData) => {
    try {
      const queryParams = new URLSearchParams(
        formData as unknown as Record<string, string>
      ).toString();

      const { data } = await axios.get(
        `${apiURL}/appuser-sitters?${queryParams}`
      );

      console.log(queryParams);

      navigate("/search_page", { state: { searchResults: data } });
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Failed to fetch search results. Please try again.");
    }
  };
  return (
    <>
      <div className="justify-items-center bg-white">
        <div className="my-6">
          {/* <img src={bannerImage} /> */}
          <h1 className="text-center text-2xl font-semibold">
            {t("homePage.subtitle")}
          </h1>
        </div>
        <h3 className="italic">{t("homePage.searchLabel")}</h3>
        <SearchBar
          onSearchSubmit={handleSearchSubmit}
          closeSearchBar={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </>
  );
};

export default HomePage;
