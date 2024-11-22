// import SignUpForm from "../components/profile/SignUpForm";
import SearchBar from "../components/search/SearchBar";
import { useTranslation, Trans } from "react-i18next";

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="justify-items-center">
        <div className="my-6">
          <h1>{t("title.subtitle")}</h1>
        </div>
        <h3>Search for a Pet Sitter</h3>
        {/* <SignUpForm /> */}
        <SearchBar />
      </div>
      ;
    </>
  );
};

export default HomePage;
