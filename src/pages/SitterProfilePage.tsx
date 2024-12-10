import EnquiryForm from "../components/enquiry/EnquiryForm";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axiosInstance from "../api/axiosInstance.ts";
import { AppUser, Review, Sitter } from "../types/userProfile.ts";
import { Done } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import Rating from "@mui/material/Rating";
import ViewAvailability from "../components/profile/ViewAvailability.tsx";
import FeaturedImageGallery from "../components/profile/FeaturedImageGallery.tsx";
import { MdOutlineArrowBackIos } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

type UserResponse = {
  appuser: AppUser;
  sitter: Sitter;
};

const SitterProfilePage: React.FC = () => {
  const [showEnquiryForm, setShowEnquiryForm] = useState<boolean>(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [availabilities, setAvailabilities] = useState<Date[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const profileResponse = await axiosInstance.get(
          `${apiURL}/appuser-extended/${id}`
        );
        setUser(profileResponse.data);

        const reviewsResponse = await axiosInstance.get(
          `${apiURL}/appuser/${id}/review`
        );
        setReviews(reviewsResponse.data);

        // Fetch availabilities
        const availabilitiesResponse = await axiosInstance.get(
          `${apiURL}/appuser/${id}/availability`
        );
        if (availabilitiesResponse.status === 200) {
          const dates = availabilitiesResponse.data.map(
            (item: { available_date: string }) => new Date(item.available_date)
          );
          setAvailabilities(dates);
        } else {
          setAvailabilities([]);
        }

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
    <div>
      <div className="container mx-auto p-12 ">
        <button onClick={() => navigate(-1)} className="my-6 flex">
          <MdOutlineArrowBackIos className="mr-3 mt-1" />{" "}
          <p>{t("request_details_page.goBack")}</p>
        </button>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-between p-6 md:px-24">
            {/* Profile Picture */}
            {user.appuser.profile_picture_src ? (
              <img
                src={user.appuser.profile_picture_src}
                alt={`${user.appuser.firstname} ${user.appuser.lastname}`}
                className="h-48 w-48 rounded-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-48 w-48 rounded-full ">
                <FaUserCircle className="h-48 w-48 text-gray-300" />
              </div>
            )}

            {/* User Details */}
            <div className="mt-4 md:ps-1 sm:mt-0 sm:ml-6 text-center sm:text-left flex-1">
              <h1 className=" text-2xl font-bold">{`${user.appuser.firstname} ${user.appuser.lastname}`}</h1>
              <div>
                {user.appuser.average_user_rating !== null && (
                  <Rating
                    className="pt-2"
                    name="read-only"
                    value={user.appuser.average_user_rating}
                    readOnly
                  />
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 sm:mt-0 sm:ml-auto flex flex-col items-center sm:items-end">
              {showEnquiryForm ? (
                <button
                  onClick={() => setShowEnquiryForm((prev: boolean) => !prev)}
                  className="btn-secondary text-sm py-1 px-2"
                >
                  {t("sitterProfilePage.close")}
                </button>
              ) : (
                <button
                  onClick={() => setShowEnquiryForm((prev: boolean) => !prev)}
                  className="btn-primary"
                >
                  {t("sitterProfilePage.makeAnEnquiry")}
                </button>
              )}
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
          <div className="p-6  border-t w-full md:px-24">
            <h2 className="text-lg font-semibold mb-4">
              {t("sitterProfilePage.accountBio")}
            </h2>
            <p>
              {user.sitter.sitter_profile_bio}
              <br />
              <br />
            </p>
            <p>{t("sitterProfilePage.iOffer")} </p>
            <p className="font-semibold">
              {user.sitter?.visit_ok ||
              user.sitter?.sitter_house_ok ||
              user.sitter?.owner_house_ok ? (
                <span className="font-italic">
                  {(() => {
                    const services = [
                      user.sitter.sitter_house_ok &&
                        t("searchPage.sitter_house"),
                      user.sitter.owner_house_ok && t("searchPage.owner_house"),
                      user.sitter.visit_ok && t("searchPage.visits"),
                    ].filter(Boolean);

                    return services.length > 1
                      ? services.slice(0, -1).join(", ") +
                          t("sitterProfilePage.and") +
                          services.slice(-1)
                      : services[0];
                  })()}
                  .
                </span>
              ) : (
                t("searchPage.notAvailable")
              )}
            </p>
          </div>

          {/* Sitter Details */}
          <div className="p-6 border-t md:px-24">
            <h2 className="text-lg font-semibold mb-4 ">
              {t("sitterProfilePage.animalsICareFor")}
            </h2>
            <p className="text-slate-500 text-sm">
              {user.sitter.dogs_ok && (
                <>
                  <Done /> {t("searchPage.dog")}
                </>
              )}
            </p>
            <p className="text-slate-500 text-sm">
              {user.sitter.cats_ok && (
                <>
                  <Done /> {t("searchPage.cat")}
                </>
              )}
            </p>
            <p className="text-slate-500 text-sm">
              {user.sitter.fish_ok && (
                <>
                  <Done /> {t("searchPage.fish")}
                </>
              )}
            </p>
            <p className="text-slate-500 text-sm">
              {user.sitter.birds_ok && (
                <>
                  <Done /> {t("searchPage.bird")}
                </>
              )}
            </p>
            <p className="text-slate-500 text-sm">
              {user.sitter.rabbits_ok && (
                <>
                  <Done /> {t("searchPage.rabbit")}
                </>
              )}
            </p>
          </div>

          {/* Profile Details */}
          <div className="p-6 border-t md:px-24">
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
                <strong>{`${t("sitterProfilePage.lastLogin")}:`}</strong>{" "}
                {user.appuser.last_login
                  ? `${formatDistanceToNow(new Date(user.appuser.last_login), {
                      addSuffix: true,
                    })}`
                  : t("sitterProfilePage.never")}
              </li>
            </ul>
          </div>

          {/* Availability Section */}
          <div className="px-6 border-t md:px-24">
            <ViewAvailability availabilities={availabilities} />
          </div>

          {/* Reviews */}
          <div className="p-6 border-t md:px-24">
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
                        {`${t("sitterProfilePage.submittedOn")} ${new Date(
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
          <div className="p-6 border-t md:px-24">
            <h2 className="text-lg font-semibold mb-4">
              {t("sitterProfilePage.additionalImages")}
            </h2>
            <FeaturedImageGallery
              picture_src_list={user.sitter.sitter_bio_picture_src_list}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SitterProfilePage;
