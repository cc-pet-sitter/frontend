import React, { useState, useEffect } from "react";
import { FaRegMessage } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { Inquiry, AppUser } from "../types/userProfile";
import WriteReview from "../components/reviews/WriteReview";

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

  const desired_service = {
    owner_house: "boarding",
    sitter_house: "stay in",
    visit: "drop in",
  };

  return (
    <div>
      <h2 className="m-6 font-bold text-2xl">
        {t("dashboard_bookings_page.title")}
      </h2>
      {bookings ? (
        <div className="flex flex-col">
          {bookings &&
            sitterInfo &&
            bookings.map((booking, index) => (
              <div
                key={index}
                className="mx-6 my-3 border border-transparent shadow-custom rounded w-72 px-4 py-2 relative"
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
                  {
                    desired_service[
                      booking.desired_service as keyof typeof desired_service
                    ]
                  }
                </p>
                <p className="text-xs text-gray-500 my-1">
                  {booking.inquiry_status}
                </p>
                <p
                  className="text-xs text-brown underline my-1 cursor-pointer hover:text-lime-600"
                  onClick={() => setSelectedBooking(booking)}
                >
                  {t("dashboard_bookings_page.review")}
                </p>
                <div className="absolute top-4 right-4 hover:text-lime-600">
                  <FaRegMessage />
                </div>
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
