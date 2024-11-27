import React, { useState, useEffect } from "react";
import { FaRegMessage } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const DashboardBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState(null); // User profile data
  const { t } = useTranslation();
  const { userInfo, currentUser } = useAuth();

  // try {
  //   const backendURL =
  //     import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
  //   const idToken = await currentUser?.getIdToken();
  //   const response = await fetch(
  //     `${backendURL}/appuser/${userInfo?.user_id}`, // Ensure correct base URL
  //     {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${idToken}`, // Include the auth token
  //       },
  //       body: JSON.stringify(data),
  //     }

  const fetchBookings = async () => {
    try {
      const idToken = await currentUser?.getIdToken();
      const response = await fetch(
        `${apiURL}/appuser/${userInfo?.user_id}/inquiry?is_sitter=false`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`, // Include the auth token
          },
        }
      );

      const data = await response.json();
      console.log("Fetched bookings", data);
      setBookings(data);
    } catch (error) {
      console.error("Unable to fetch bookings", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const desired_service = {
    owner_house: "boarding",
    sitter_house: "stay in",
    visit: "drop in",
  };

  return (
    <div>
      <h2 className="mx-6 mb-2 font-bold text-2xl">
        {t("dashboard_bookings_page.title")}
      </h2>
      <div className="flex flex-col">
        {bookings?.map((booking) => (
          <div className="mx-6 my-2 border border-transparent shadow-custom rounded w-72 px-4 py-2 relative">
            <h3 className="text-sm font-medium my-1">Booked with Honoka</h3>
            <p className="text-xs text-gray-500 my-1">
              {booking.start_date.replaceAll("-", "/")} -{" "}
              {booking.end_date.replaceAll("-", "/")}
            </p>
            <p className="text-xs text-gray-500 my-1">
              {desired_service[booking.desired_service]}
            </p>
            <p className="text-xs text-gray-500 my-1">
              {booking.inquiry_status}
            </p>
            <p className="text-xs underline my-1 cursor-pointer hover:text-lime-600">
              {t("dashboard_bookings_page.review")}
            </p>
            <div className="absolute top-4 right-4 hover:text-lime-600">
              <FaRegMessage />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardBookingsPage;
