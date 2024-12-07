import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import axiosInstance from "../api/axiosInstance.ts";
import { useTranslation } from "react-i18next";
import { formatDistanceToNow } from "date-fns";
import Rating from "@mui/material/Rating";
import { Done } from "@mui/icons-material";
import { FaUserCircle } from "react-icons/fa";
import { TailSpin } from 'react-loader-spinner'
import { AppUser, Review, Sitter } from "../types/userProfile.ts";
import EditSitterProfileForm from "../components/profile/EditSitterProfileForm";
import ViewAvailability from "../components/profile/ViewAvailability";
import FeaturedImageGallery from "../components/profile/FeaturedImageGallery.tsx";
import { useNavigate } from "react-router-dom";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const DashboardSitterProfilePage: React.FC = () => {
  const [sitterProfile, setSitterProfile] = useState<Sitter | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showEditProfileForm, setShowEditProfileForm] =
    useState<boolean>(false);
  const [availabilities, setAvailabilities] = useState<Date[]>([]);
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  
  const { userInfo } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const fetchAllProfileData = async () => {
    if (userInfo) {
      try {
        const profileResponse = await axiosInstance.get(
          `${apiURL}/appuser-extended/${userInfo.id}`
        );
        setUser(profileResponse.data.appuser);
        setSitterProfile(profileResponse.data.sitter);

        const reviewsResponse = await axiosInstance.get(
          `${apiURL}/appuser/${userInfo.id}/review`
        );
        setReviews(reviewsResponse.data);

        // Fetch availabilities
        const availabilitiesResponse = await axiosInstance.get(
          `${apiURL}/appuser/${userInfo.id}/availability`
        );
        if (availabilitiesResponse.status === 200) {
          const dates = availabilitiesResponse.data.map(
            (item: { available_date: string }) => new Date(item.available_date)
          );
          setAvailabilities(dates);
        } else {
          setAvailabilities([]);
        }
      } catch (error) {
        console.error("Unable to fetch sitter profile", error);
      }
    }
  };

  useEffect(() => {
    fetchAllProfileData();
  }, []);

  const handleSave = () => {
    // setSitterProfile(updatedProfile);
    setShowEditProfileForm(false);
    fetchAllProfileData();
  };

  return (
    <div className="dashboard-container">
      {showEditProfileForm ? (
        
        <div className="">
          <EditSitterProfileForm
            fetchAllProfileData={fetchAllProfileData}
            sitterProfile={sitterProfile}
            closeEditForm={() => setShowEditProfileForm(false)}
            onSave={handleSave}
          />
        </div>
      ) : user && sitterProfile ? (
        <> 
          {/* If there is a sitter registered profile display it  */}
          <div className="container mx-auto p-6">
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center p-6">

                {!imageLoaded && (
                  <div className="flex items-center justify-center bg-gray-300 h-48 w-48 rounded-full ">
                    <TailSpin
                      height="50"
                      width="50"
                      color="#fabe25"
                      ariaLabel="loading"
                    />
                  </div>
                )}
                {user.profile_picture_src ? (
                  <img
                    src={user.profile_picture_src}
                    alt={user.firstname}
                    className={`h-48 w-48 rounded-full object-cover ${
                      imageLoaded ? "block" : "hidden"
                    }`}
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}
                  />
                ) : (
                  <div className="flex items-center justify-center bg-gray-300 h-48 w-48 rounded-full ">
                    <FaUserCircle className="h-40 w-40" color="white" />
                  </div>
                )}

                <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                  <h1 className="text-2xl font-bold">{user.firstname}</h1>
                  {/* Comment below for privacy reasons */}
                  {/* <h1 className="text-2xl font-bold">{`${user.firstname} ${user.lastname}`}</h1> */}
                  {/* <p className="text-gray-500">{user.appuser.email}</p> */}
                </div>
                <div>
                  {user.average_user_rating !== null && (
                    <Rating
                      className="pt-2"
                      name="read-only"
                      value={user.average_user_rating}
                      readOnly
                    />
                  )}
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

              {/* Availability Section */}
              <ViewAvailability availabilities={availabilities} />

              {/* Reviews */}
              <div className="p-6 border-t">
                <h2 className="text-lg font-semibold mb-4">
                  {t("sitterProfilePage.reviews")}
                </h2>
                {reviews.length === 0 ? (
                  <p className="text-left text-gray-500">
                    {`${user.firstname} ${t("sitterProfilePage.noReviews")}`}
                  </p>
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
                <FeaturedImageGallery
                  picture_src_list={sitterProfile.sitter_bio_picture_src_list || ""}
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
          <div className="flex flex-col items-center justify-center h-screen text-center">
            <h1 className="mb-2 font-bold text-2xl">
              {t("dashboard_Sitter_Profile_page.createHeader")}
            </h1>
            {!user?.profile_picture_src ? (
              // User has not even profile picture, so send user to complete user profile
              <div>
                <p className="mb-4">
                  {t("dashboard_Sitter_Profile_page.createSubtitleNoGo")}
                </p>
                <button
                  onClick={() => navigate('/dashboard/account')}
                  className="shadow btn-primary focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded"
                >
                  {t("dashboard_Sitter_Profile_page.createButtonNoGo")}
                </button>
              </div>
            ) : (
              // Has a picture profile then assume complete user profile and allow to create sitter profile
              <div>
                <p className="mb-4">
                  {t("dashboard_Sitter_Profile_page.createSubtitleGo")}
                </p>
                <button
                  onClick={() => setShowEditProfileForm(true)}
                  className="shadow btn-primary focus:shadow-outline focus:outline-none font-bold py-2 px-4 rounded"
                >
                  {t("dashboard_Sitter_Profile_page.createButtonGo")}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardSitterProfilePage;
