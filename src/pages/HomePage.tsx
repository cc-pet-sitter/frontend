import { useNavigate } from "react-router-dom";
import SearchBar from "../components/search/SearchBar";
import { useTranslation } from "react-i18next";
import axios from "axios";

interface HomePageProps {
  onSearchSubmit: (data: unknown) => void;
}

const HomePage: React.FC<HomePageProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSearchSubmit = async (formData: Record<string, unknown>) => {
    try {
      const queryParams = new URLSearchParams(
        formData as Record<string, string>
      ).toString();

      console.log(queryParams);

      const { data } = await axios.get(
        `http://localhost:8000/appuser-sitters?${queryParams}`
      );

      navigate("/search", { state: { searchResults: data } });
    } catch (error) {
      console.error("Error fetching search results:", error);
      alert("Failed to fetch search results. Please try again.");
    }
  };

  return (
    <>
      <div className="justify-items-center">
        <div className="my-6">
          <h1>{t("homePage.subtitle")}</h1>
        </div>
        <h3>{t("homePage.searchLabel")}</h3>
        {/* <SignUpForm /> */}
        <SearchBar onSearchSubmit={handleSearchSubmit} />
      </div>
      ;
    </>
  );
};

export default HomePage;
