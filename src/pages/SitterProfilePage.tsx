import EnquiryForm from "../components/enquiry/EnquiryForm";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";

const SitterProfilePage: React.FC = () => {
  const [showEnquiryForm, setShowEnquiryForm] = useState<boolean>(false);
  const [user, setUser] = useState(null); // User profile data
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/appuser-extended/${id}`
        );
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError("Couldn't fetch profile.");
        setLoading(false);
      }
    };

    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  console.log(user);

  if (loading) {
    return <p>{t("sitterProfilePage.loading")}</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>{t("sitterProfilePage.userNotFound")}</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center p-6">
          <img
            src={user.appuser.profile_picture_src}
            alt={`${user.appuser.firstname} ${user.appuser.lastname}`}
            className="h-48 w-48 rounded-full object-cover"
          />
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{`${user.appuser.firstname} ${user.appuser.lastname}`}</h1>
            <p className="text-gray-500">{user.appuser.email}</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col items-center">
            <button
              onClick={() => setShowEnquiryForm((prev: boolean) => !prev)}
              className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
            >
              {showEnquiryForm
                ? t("sitterProfilePage.close")
                : t("sitterProfilePage.makeAnEnquiry")}
            </button>
            {showEnquiryForm && (
              <div className="mt-6 w-full sm:w-auto">
                <EnquiryForm />
              </div>
            )}
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 border-t">
          <h2 className="text-lg font-semibold mb-4">
            {t("sitterProfilePage.profileDetails")}
          </h2>
          <ul className="list-none space-y-2 text-left">
            <li>
              <strong>{`${t("sitterProfilePage.location")}:`}</strong>{" "}
              {`${user.appuser.prefecture}, ${user.appuser.city_ward}`}
            </li>
            <li>
              <strong>{`${t("sitterProfilePage.address")}:`}</strong>{" "}
              {user.appuser.street_address}
            </li>
            <li>
              <strong>{`${t("sitterProfilePage.postCode")}:`}</strong>{" "}
              {user.appuser.postal_code}
            </li>
            <li>
              <strong>{`${t("sitterProfilePage.languages")}:`}</strong>{" "}
              {user.appuser.english_ok && user.appuser.japanese_ok
                ? t("sitterProfilePage.englishJapanese")
                : user.appuser.english_ok
                ? t("sitterProfilePage.english")
                : t("sitterProfilePage.japanese")}
            </li>
          </ul>
        </div>

        {/* Timestamps */}
        <div className="p-6 border-t">
          <h2 className="text-lg font-semibold mb-4">
            {t("sitterProfilePage.accountInformation")}
          </h2>
          <ul className="list-none space-y-2 text-left">
            <li>
              <strong>{`${t("sitterProfilePage.accountCreated")}:`}</strong>{" "}
              {new Date(user.appuser.account_created).toLocaleString()}
            </li>
            <li>
              <strong>{`${t("sitterProfilePage.lastLogin")}:`}</strong>{" "}
              {new Date(user.appuser.last_login).toLocaleString()}
            </li>
            <li>
              <strong>{`${t("sitterProfilePage.lastUpdated")}:`}</strong>{" "}
              {new Date(user.appuser.last_updated).toLocaleString()}
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={() => navigate(-1)}
          className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
        >
          {t("sitterProfilePage.backToSearchResults")}
        </button>
      </div>
    </div>
  );
};

export default SitterProfilePage;
