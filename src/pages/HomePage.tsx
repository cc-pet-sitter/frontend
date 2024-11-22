// import SignUpForm from "../components/profile/SignUpForm";
import SearchBar from "../components/search/SearchBar";

const HomePage: React.FC = () => (
  <div className="justify-items-center">
    <div className="my-6">
      <h1>Find a trusted Pet Sitter or list your services!</h1>
    </div>
    <h3>Search for a Pet Sitter</h3>
    {/* <SignUpForm /> */}
    <SearchBar />
  </div>
);

export default HomePage;
