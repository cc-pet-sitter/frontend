import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import axios from "axios";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;
import EditSitterProfileForm from "../components/profile/EditSitterProfileForm";
import { Done } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";
import Rating from "@mui/material/Rating";
import { AppUser, Review, Sitter } from "../types/userProfile.ts";
import ViewMultiPicture from "../components/profile/ViewMultiPicture.tsx";

const DashboardSitterProfilePage: React.FC = () => {
  const [sitterProfile, setSitterProfile] = useState<Sitter | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const { t } = useTranslation();
  const { userInfo } = useAuth();
  const [showEditProfileForm, setShowEditProfileForm] =
    useState<boolean>(false);

  const fetchAllProfileData = async (is_sitter: boolean | null | undefined) => {
    if (userInfo && is_sitter) {
      try {
        const profileResponse = await axios.get(
          `${apiURL}/appuser-extended/${userInfo.id}`
        );
        setUser(profileResponse.data.appuser);
        setSitterProfile(profileResponse.data.sitter);

        const reviewsResponse = await axios.get(
          `${apiURL}/appuser/${userInfo.id}/review`
        );
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error("Unable to fetch sitter profile", error);
      }
    }
  };

  const fetchSitterProfile = async (is_sitter: boolean | null | undefined) => {
    if (is_sitter) {
      try {
        const response = await axios.get(`${apiURL}/sitter/${userInfo?.id}`);
        setSitterProfile(response.data);
      } catch (error) {
        console.error("Unable to fetch sitter profile", error);
      }
    }
  };

  useEffect(() => {
    fetchAllProfileData(userInfo?.is_sitter);
  }, []);

  const handleSave = (updatedProfile: Sitter) => {
    setSitterProfile(updatedProfile);
    setShowEditProfileForm(false);
  };

  return (
    <div className="dashboard-container">
      {showEditProfileForm ? (
        <div className="">
          <EditSitterProfileForm
            fetchSitterProfile={fetchSitterProfile}
            sitterProfile={sitterProfile}
            closeEditForm={() => setShowEditProfileForm(false)}
            onSave={handleSave}
          />
        </div>
      ) : sitterProfile && user ? (
        <>
          <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center p-6">
                <img
                  src={
                    sitterProfile?.sitter_bio_picture_src_list ||
                    "https://firebasestorage.googleapis.com/v0/b/petsitter-84e85.firebasestorage.app/o/user_profile_pictures%2Fdefault-profile.svg?alt=media&token=aa84dc5e-41e5-4f6a-b966-6a1953b25971"
                  }
                  alt={`${user.firstname} ${user.lastname}`}
                  className="h-48 w-48 rounded-full object-cover"
                />
                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{`${user.firstname} ${user.lastname}`}</h1>
                  {/* <p className="text-gray-500">{user.appuser.email}</p> */}
                </div>
                <div>
                  <Rating
                    className="pt-2"
                    name="read-only"
                    value={user.average_user_rating}
                    readOnly
                  />
                </div>
              </div>

              {/* Account Bio */}
              <div className="p-6 border-t">
                <h2 className="text-lg font-semibold mb-4">Bio</h2>
                <p>{sitterProfile.sitter_profile_bio}</p>
              </div>

              {/* Sitter Details */}
              <div className="p-6 border-t">
                <h2 className="text-lg font-semibold mb-4">
                  {t("sitterProfilePage.animalsICareFor")}
                </h2>
                <p className="text-slate-500 text-sm">
                  {sitterProfile.dogs_ok && (
                    <>
                      <Done /> {t("searchPage.dog")}
                    </>
                  )}
                </p>
                <p className="text-slate-500 text-sm">
                  {sitterProfile.cats_ok && (
                    <>
                      <Done /> {t("searchPage.cat")}
                    </>
                  )}
                </p>
                <p className="text-slate-500 text-sm">
                  {sitterProfile.fish_ok && (
                    <>
                      <Done /> {t("searchPage.fish")}
                    </>
                  )}
                </p>
                <p className="text-slate-500 text-sm">
                  {sitterProfile.birds_ok && (
                    <>
                      <Done /> {t("searchPage.bird")}
                    </>
                  )}
                </p>
                <p className="text-slate-500 text-sm">
                  {sitterProfile.rabbits_ok && (
                    <>
                      <Done /> {t("searchPage.rabbit")}
                    </>
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
                    {`${user.prefecture}, ${user.city_ward}`}
                  </li>
                  <li>
                    <strong>{`${t("sitterProfilePage.postCode")}:`}</strong>{" "}
                    {user.postal_code}
                  </li>
                  <li>
                    <strong>{`${t("sitterProfilePage.languages")}:`}</strong>{" "}
                    {user.english_ok && user.japanese_ok
                      ? t("sitterProfilePage.englishJapanese")
                      : user.english_ok
                      ? t("sitterProfilePage.english")
                      : t("sitterProfilePage.japanese")}
                  </li>
                  <li>
                    <strong>{`${t(
                      "sitterProfilePage.accountCreated"
                    )}:`}</strong>{" "}
                    {user.account_created
                      ? `${formatDistanceToNow(new Date(user.account_created))}`
                      : t("sitterProfilePage.never")}
                  </li>
                  <li>
                    <strong>{`${t("sitterProfilePage.lastLogin")}:`}</strong>{" "}
                    {user.last_login
                      ? `${formatDistanceToNow(new Date(user.last_login), {
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
                  <p>{`${user.firstname} ${t(
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
                    sitterProfile.sitter_bio_picture_src_list || ""
                  }
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowEditProfileForm(true)}
                className="mx-4 shadow btn-secondary focus:shadow-outline focus:outline-none text-white font-bold py-2 px-5 text-sm rounded"
              >
                {t("dashboard_Sitter_Profile_page.edit_button")}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <h1 className="mx-6 mb-2 font-bold text-2xl">Become a Sitter</h1>
          <p className="mx-6">
            Create your sitter profile to start offering services.
          </p>
          <button
            onClick={() => setShowEditProfileForm(true)}
            className="m-6 shadow btn-primary focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded"
          >
            Create Profile
          </button>
        </>
      )}
    </div>
  );
};

export default DashboardSitterProfilePage;
