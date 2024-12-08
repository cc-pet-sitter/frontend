import React, { useState, useEffect } from "react";
import { FaRegMessage } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { Inquiry, AppUser } from "../types/userProfile";
import WriteReview from "../components/reviews/WriteReview";
import { Link } from "react-router-dom";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const DashboardBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Array<Inquiry> | null>(null); // User profile data
  const [sitterInfo, setSitterInfo] = useState<Array<AppUser> | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Inquiry | null>(null);

  const { t } = useTranslation();
  const { userInfo, currentUser } = useAuth();

  const fetchAll = async () => {
    try {
      const idToken = await currentUser?.getIdToken();

      console.log(userInfo);
      if (!userInfo?.id) {
        console.error("User information is missing!");
        return;
      }

      const bookingsResponse = await fetch(
        `${apiURL}/appuser/${userInfo?.id}/inquiry?is_sitter=false`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      if (!bookingsResponse.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const fetchBookings = await bookingsResponse.json();
      console.log("Fetched bookings", fetchBookings);

      if (!fetchBookings || fetchBookings.length === 0) {
        console.warn("No bookings available to fetch sitter names");
        setBookings(null);
        return;
      }
      setBookings(fetchBookings);

      const sitterNamePromises = fetchBookings.map((booking: Inquiry) => {
        return fetch(`${apiURL}/appuser/${booking.sitter_appuser_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });
      });

      const sitterResponses = await Promise.all(sitterNamePromises);

      const sitterInfoPromises = sitterResponses.map(
        async (response, index) => {
          if (!response.ok) {
            console.error(
              `Error with sitter info request ${index + 1} : ${response.status}`
            );
            return null;
          }
          const json = await response.json();
          return json;
        }
      );

      const sitterInfoData = await Promise.all(sitterInfoPromises);
      setSitterInfo(sitterInfoData);
      console.log("Fetched sitter info", sitterInfoData);
    } catch (error) {
      console.error("Error fetching bookings and sitter info:", error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, [userInfo]);

  return (
    <div className="md:m-14">
      <h2 className="m-6 font-bold text-2xl">
        {t("dashboard_bookings_page.title")}
      </h2>
      {bookings ? (
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-2 md:gap-y-4 md:justify-stretch">
          {bookings &&
            sitterInfo &&
            bookings.map((booking, index) => (
              <div
                key={index}
                className="mx-6 my-3 border border-transparent shadow-custom rounded w-72 px-4 py-2 relative"
              >
                <Link 
                  to={`/dashboard/requests/${booking.id}`}
                  state={{ from: "bookings "}}  
                >
                    <h3 className="text-sm font-medium my-1">
                      {t("dashboard_bookings_page.booked_with_en")}{" "}
                      {sitterInfo[index].firstname}
                      {t("dashboard_bookings_page.booked_with_jp")}
                    </h3>
                  <p className="text-xs text-gray-500 my-1">
                    {new Date(booking.start_date).toLocaleDateString("ja-JP")} -{" "}
                    {new Date(booking.end_date).toLocaleDateString("ja-JP")}
                  </p>
                  <p className="text-xs text-gray-500 my-1">
                    {t("dashboard_bookings_page.service")}
                    {booking.desired_service === "sitter_house" &&
                      t("dashboard_Sitter_Profile_page.sitter_house")}
                    {booking.desired_service === "owner_house" &&
                      t("dashboard_Sitter_Profile_page.owner_house")}
                    {booking.desired_service === "visit" &&
                      t("dashboard_Sitter_Profile_page.visits")}
                  </p>
                  <p className="text-xs text-gray-500 my-1">
                    {t("dashboard_bookings_page.status")}
                    {booking.inquiry_status === "requested" &&
                      t("request_details_page.requested")}
                    {booking.inquiry_status === "approved" &&
                      t("request_details_page.approved")}
                    {booking.inquiry_status === "rejected" &&
                      t("request_details_page.rejected")}
                  </p>
                  <div className="absolute top-4 right-4 hover:text-lime-600">
                    <FaRegMessage />
                  </div>
                </Link>
                {booking.inquiry_status == "approved" ? (
                  <p
                    className="text-xs text-brown underline my-1 cursor-pointer hover:text-lime-600"
                    onClick={() => setSelectedBooking(booking)}
                  >
                    {t("dashboard_bookings_page.review")}
                  </p>
                ) : (
                  <p className="text-xs invisible">Unreviewed</p>
                )}
              </div>
            ))}
        </div>
      ) : (
        <p className="mx-6 mb-2">{t("dashboard_bookings_page.no_bookings")}</p>
      )}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <WriteReview
              booking={selectedBooking}
              onClose={() => setSelectedBooking(null)}
              recipientType="sitter"
            />
            <button
              onClick={() => setSelectedBooking(null)}
              className="mt-4 text-red-500"
            >
              {t("dashboard_bookings_page.close_review")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardBookingsPage;
