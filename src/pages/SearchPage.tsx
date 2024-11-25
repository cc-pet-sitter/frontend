import { useEffect, useState } from "react";
import SearchResults from "../components/search/SearchResults";
import { appUsers } from "../dummyusers/dummyData";
import { AppUser } from "../types/userProfile";

interface SearchPageProps {
  appUsers: AppUser[];
}

const SearchPage: React.FC<SearchPageProps> = () => {
  const [filteredData, setFilteredData] = useState<AppUser[]>([]);

  // Simulate fetching data for the search results
  // If you are receiving data via props or navigation, make sure you handle it
  useEffect(() => {
    setFilteredData(appUsers); // Set default filtered data
  }, []);

  return (
    <div>
      {/* Pass filteredData as appUsers prop */}
      <SearchResults appUsers={filteredData} />
    </div>
  );
};

export default SearchPage;
