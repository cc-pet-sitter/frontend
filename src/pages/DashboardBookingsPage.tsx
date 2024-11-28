import React, { useState, useEffect } from "react";
import { FaRegMessage } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import { VscLaw } from "react-icons/vsc";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const DashboardBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState(null); // User profile data
  const [sitterInfo, setSitterInfo] = useState(null);
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

  // const fetchSitterName = async () => {
  //   console.log(bookings);
  //   try {
  //     const idToken = await currentUser?.getIdToken();

  //     if (!bookings || bookings.length === 0) {
  //       console.warn("No bookings to fetch sitter names for.");
  //       return;
  //     }

  //     console.log(bookings);
  //     const responsePromises = bookings?.map((booking) => {
  //       console.log("insise map", booking);
  //       return fetch(`${apiURL}/appuser/${booking?.sitter_appuser_id}`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${idToken}`, // Include the auth token
  //         },
  //       });
  //     });

  //     const responses = await Promise.all(responsePromises);

  //     console.log(responses);
  //     const dataPromises = responses.map(async (response) => {
  //       if (!response.ok) {
  //         throw new Error(`HTTP error, status: ${response.status}`);
  //         return null;
  //       }
  //       const json = await response.json();
  //       return json;
  //     });

  //     const data = await Promise.all(dataPromises);
  //     console.log("Fetched sitter info", data);
  //     setSitterInfo(data);
  //   } catch (error) {
  //     console.error("Unable to fetch sitter info", error);
  //   }
  // };

  // const fetchAll = async () => {
  //   await fetchBookings();
  //   console.log(bookings);
  //   await fetchSitterName();
  // };

  const fetchAll = async () => {
    try {
      const idToken = await currentUser?.getIdToken();

      if (!userInfo?.user_id) {
        console.error("User information is missing!");
        return;
      }

      const bookingsResponse = await fetch(
        `${apiURL}/appuser/${userInfo?.user_id}/inquiry?is_sitter=false`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`, // Include the auth token
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

      const sitterNamePromises = fetchBookings.map((booking) => {
        console.log("insise map", booking);
        return fetch(`${apiURL}/appuser/${booking.sitter_appuser_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`, // Include the auth token
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
      // setSitterInfo(sitterInfoData.filter((info) => info !== null));
      console.log("Fetched sitter info", sitterInfoData);
      console.log("Fetched sitter info", sitterInfo);
    } catch (error) {
      console.error("Error fetching bookings and sitter info:", error);
    }
  };

  useEffect(() => {
    fetchAll();
    console.log(bookings);
  }, [userInfo]);

  useEffect(() => {
    if (bookings && bookings.length > 0) {
      console.log("Bookings updated:", bookings);
    } else {
      console.log("No bookings available");
    }
  }, [bookings]); // This will run every time `bookings` changes.

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
        {bookings?.map((booking, index) => (
          <div className="mx-6 my-2 border border-transparent shadow-custom rounded w-72 px-4 py-2 relative">
            <h3 className="text-sm font-medium my-1">
              {/* Booked with {sitterInfo[index]?.firstname} */}
              Booked with Honoka
            </h3>
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
