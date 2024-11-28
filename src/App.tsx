import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  // Link,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import SitterProfilePage from "./pages/SitterProfilePage";
import SearchPage from "./pages/SearchPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Login from "./components/auth/Login";
import SignUp from "./components/auth/Signup";
import { useAuth } from "./contexts/AuthContext";
import DashboardBookingsPage from "./pages/DashboardBookingsPage";
import DashboardRequestsPage from "./pages/DashboardRequestsPage";
import DashboardSitterProfilePage from "./pages/DashboardSitterProfilePage";
import DashboardAccountPage from "./pages/DashboardAccountPage";
import { appUsers } from "./dummyusers/dummyData";
import SearchResults from "./components/search/SearchResults";

const App: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="flex flex-col h-screen justify-between">
        <Header />
        <div>
          <nav>
            <ul>
              {/* <li>
                <Link to="/search_page">Search Page</Link>
              </li> */}
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
          <Routes>
            <Route path="/profile/:id" element={<SitterProfilePage />} />
            <Route
              path="/search_page"
              element={<SearchPage appUsers={appUsers} />}
            />
            <Route path="/search" element={<SearchResults appUsers={[]} />} />
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route
              path="/dashboard/bookings"
              element={<DashboardBookingsPage />}
            />
            <Route
              path="/dashboard/requests"
              element={<DashboardRequestsPage />}
            />
            <Route
              path="/dashboard/sitter_profile"
              element={<DashboardSitterProfilePage />}
            />
            <Route
              path="/dashboard/account"
              element={<DashboardAccountPage />}
            />
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
