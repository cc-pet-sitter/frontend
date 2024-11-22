import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import SitterProfilePage from "./pages/SitterProfilePage";
import SearchPage from "./pages/SearchPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/Signup";
import { useAuth } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
// import Dashboard from "./pages/Dashboard";

const App: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="flex flex-col h-screen justify-between">
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
            <Route
              path="/sitter_profile_page"
              element={<SitterProfilePage />}
            />
            <Route path="/search_page" element={<SearchPage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/login"
              element={!currentUser ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/signup"
              element={!currentUser ? <SignUp /> : <Navigate to="/" />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
