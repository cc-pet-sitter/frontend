// import SignUpForm from "../components/profile/SignUpForm";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/search/SearchBar";
import { useTranslation } from "react-i18next";

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleSearchSubmit = (formData: unknown) => {
    console.log("Form Data Submitted:", formData);
    // Navigate to the Search Results page with query parameters
    navigate("/search", { state: { searchQuery: formData } });
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
