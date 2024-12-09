import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "./utils/ScrollToTop";
import HomePage from "./pages/HomePage";
import PetProfilesPage from "./pages/PetProfilesPage";
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
import DashboardPetsProfilePage from "./pages/DashboardPetsProfilePage.tsx";
import DashboardAccountPage from "./pages/DashboardAccountPage";
import SearchResults from "./components/search/SearchResults";
import DashboardRequestDetailPage from "./pages/DashboardRequestDetailPage";
import PrivacyPolicy from "./pages/PrivacyPolicy.tsx";
import ContactPage from "./pages/Contact.tsx";

const App: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white w-full">
        <Header />
        <div className="flex-grow pt-12">
          <nav>
            <ul></ul>
          </nav>
          <ScrollToTop />
          <Routes>
            <Route path="/profile/:id" element={<SitterProfilePage />} />
            <Route path="/search_page" element={<SearchPage />} />
            <Route path="/search" element={<SearchResults appUsers={[]} />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/pet_profiles" element={<PetProfilesPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route
              path="/dashboard/bookings"
              element={<DashboardBookingsPage />}
            />
            <Route
              path="/dashboard/requests"
              element={<DashboardRequestsPage />}
            />
            <Route
              path="/dashboard/requests/:requestId"
              element={<DashboardRequestDetailPage />}
            />
            <Route
              path="/dashboard/sitter_profile"
              element={<DashboardSitterProfilePage />}
            />
            <Route
              path="/dashboard/pets_profile"
              element={<DashboardPetsProfilePage />}
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
