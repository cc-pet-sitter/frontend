import EnquiryForm from "../components/enquiry/EnquiryForm";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { AppUser, Review, Sitter } from "../types/userProfile.ts";
import { Done } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
// import WriteReview from "../components/reviews/WriteReview.tsx";
import ViewMultiPicture from "../components/profile/ViewMultiPicture.tsx";
import Rating from "@mui/material/Rating";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

type UserResponse = {
  appuser: AppUser;
  sitter: Sitter;
};

const SitterProfilePage: React.FC = () => {
  const [showEnquiryForm, setShowEnquiryForm] = useState<boolean>(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  console.log(user);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const profileResponse = await axios.get(
          `${apiURL}/appuser-extended/${id}`
        );
        setUser(profileResponse.data);

        const reviewsResponse = await axios.get(
          `${apiURL}/appuser/${id}/review`
        );
        setReviews(reviewsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Couldn't fetch data.");
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return <p>{t("sitterProfilePage.loading")}</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>{t("sitterProfilePage.userNotFound")}</p>;
  }

  const handleCloseEnquiryForm = () => {
    setShowEnquiryForm(false);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center p-6">
          <img
            src={user.sitter.sitter_bio_picture_src_list}
            alt={`${user.appuser.firstname} ${user.appuser.lastname}`}
            className="h-48 w-48 rounded-full object-cover"
          />
          <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{`${user.appuser.firstname} ${user.appuser.lastname}`}</h1>
            {/* <p className="text-gray-500">{user.appuser.email}</p> */}
          </div>
          <div>
            <Rating
              className="pt-2"
              name="read-only"
              value={user.appuser.average_user_rating}
              readOnly
            />
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col items-center">
            <button
              onClick={() => setShowEnquiryForm((prev: boolean) => !prev)}
              className="btn-primary"
            >
              {showEnquiryForm
                ? t("sitterProfilePage.close")
                : t("sitterProfilePage.makeAnEnquiry")}
            </button>
            {showEnquiryForm && (
              <div className="mt-6 w-full sm:w-auto">
                <EnquiryForm
                  sitterId={id}
                  closeEnquiryForm={handleCloseEnquiryForm}
                />
              </div>
            )}
          </div>
        </div>

        {/* Account Bio */}
        <div className="p-6 border-t">
          <h2 className="text-lg font-semibold mb-4">Bio</h2>
          <p>{user.sitter.sitter_profile_bio}</p>
        </div>

        {/* Sitter Details */}
        <div className="p-6 border-t">
          <h2 className="text-lg font-semibold mb-4">
            {t("sitterProfilePage.animalsICareFor")}
          </h2>
          <p className="text-slate-500 text-sm">
            {user.sitter.dogs_ok ? (
              <>
                <Done /> {t("searchPage.dog")}
              </>
            ) : (
              <>{/* <NotInterested /> {t("searchPage.dog")} */}</>
            )}
          </p>
          <p className="text-slate-500 text-sm">
            {user.sitter.cats_ok ? (
              <>
                <Done /> {t("searchPage.cat")}
              </>
            ) : (
              <>{/* <NotInterested /> {t("searchPage.cat")} */}</>
            )}
          </p>
          <p className="text-slate-500 text-sm">
            {user.sitter.fish_ok ? (
              <>
                <Done /> {t("searchPage.fish")}
              </>
            ) : (
              <>{/* <NotInterested /> {t("searchPage.fish")} */}</>
            )}
          </p>
          <p className="text-slate-500 text-sm">
            {user.sitter.birds_ok ? (
              <>
                <Done /> {t("searchPage.bird")}
              </>
            ) : (
              <>{/* <NotInterested /> {t("searchPage.bird")} */}</>
            )}
          </p>
          <p className="text-slate-500 text-sm">
            {user.sitter.rabbits_ok ? (
              <>
                <Done /> {t("searchPage.rabbit")}
              </>
            ) : (
              <>{/* <NotInterested /> {t("searchPage.rabbit")} */}</>
            )}
          </p>
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
            <li>
              <strong>{`${t("sitterProfilePage.accountCreated")}:`}</strong>{" "}
              {user.appuser.account_created
                ? `${formatDistanceToNow(
                    new Date(user.appuser.account_created)
                  )}`
                : t("sitterProfilePage.never")}
            </li>
            <li>
              <strong>{`${t("sitterProfilePage.lastLogin")}:`}</strong>{" "}
              {user.appuser.last_login
                ? `${formatDistanceToNow(new Date(user.appuser.last_login), {
                    addSuffix: true,
                  })}`
                : t("sitterProfilePage.never")}
            </li>
          </ul>
        </div>
        {/* Reviews */}
        <div className="p-6 border-t">
          <h2 className="text-lg font-semibold mb-4">
            {t("sitterProfilePage.reviews")}
          </h2>
          {reviews.length === 0 ? (
            <p>{`${user.appuser.firstname} ${t(
              "sitterProfilePage.noReviews"
            )}`}</p>
          ) : (
            <ul className="list-none space-y-4">
              {reviews.map((review) => (
                <li
                  key={review.id}
                  className="p-4 bg-gray-100 rounded-md shadow"
                >
                  <div>
                    <p className="text-sm text-gray-500">
                      {`Submitted on: ${new Date(
                        review.submission_date
                      ).toLocaleDateString()}`}
                    </p>
                    <Rating
                      className="pt-2"
                      name="read-only"
                      value={review.score}
                      readOnly
                    />
                    <p className="mt-2">{review.comment}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Additional Images */}
        <div className="p-6 border-t">
          <h2 className="text-lg font-semibold mb-4">
            {t("sitterProfilePage.additionalImages")}
          </h2>
          <ViewMultiPicture
            sitter_bio_picture_src_list={
              user.sitter.sitter_bio_picture_src_list || ""
            }
          />
        </div>
      </div>
      <div className="mt-6 text-center">
        <button onClick={() => navigate(-1)} className="btn-secondary">
          {t("sitterProfilePage.backToSearchResults")}
        </button>
      </div>
    </div>
  );
};

export default SitterProfilePage;
