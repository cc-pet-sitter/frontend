import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SitterProfilePage from "./pages/SitterProfilePage";
import SearchPage from "./pages/SearchPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <div>
        {/* <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/sitter_profile_page">Sitter Profile Page</Link>
            </li>
            <li>
              <Link to="/search_page">Search Page</Link>
            </li>
          </ul>
        </nav> */}

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/sitter_profile_page" element={<SitterProfilePage />} />
          <Route path="/search_page" element={<SearchPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
