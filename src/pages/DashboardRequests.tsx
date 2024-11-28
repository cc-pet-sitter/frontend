import React, { useState, useEffect } from "react";
import { FaRegMessage } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const DashboardRequests: React.FC = () => {
  const [requests, setRequests] = useState(null); // User profile data
  const [ownerInfo, setOwnerInfo] = useState(null);
  const { t } = useTranslation();
  const { userInfo, currentUser } = useAuth();

  const fetchAll = async () => {
    try {
      const idToken = await currentUser?.getIdToken();

      if (!userInfo?.user_id) {
        console.error("User information is missing!");
        return;
      }

      const requestsResponse = await fetch(
        `${apiURL}/appuser/${userInfo?.user_id}/inquiry?is_sitter=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`, // Include the auth token
          },
        }
      );

      if (!requestsResponse.ok) {
        throw new Error("Failed to fetch requests");
      }

      const fetchRequests = await requestsResponse.json();
      console.log("Fetched requests", fetchRequests);

      if (!fetchRequests || fetchRequests.length === 0) {
        console.warn("No requests available to fetch sitter names");
        setRequests(null);
        return;
      }
      setRequests(fetchRequests);

      //   const ownerNamePromises = fetchRequests.map((request) => {
      //     console.log("insise map", request);
      //     return fetch(`${apiURL}/appuser/${request.owner_appuser_id}`, {
      //       method: "GET",
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${idToken}`, // Include the auth token
      //       },
      //     });
      //   });

      //   const ownerResponses = await Promise.all(ownerNamePromises);

      //   const ownerInfoPromises = ownerResponses.map(async (response, index) => {
      //     if (!response.ok) {
      //       console.error(
      //         `Error with sitter info request ${index + 1} : ${response.status}`
      //       );
      //       return null;
      //     }
      //     const json = await response.json();
      //     return json;
      //   });

      //   const ownerInfoData = await Promise.all(ownerInfoPromises);

      //   setOwnerInfo(ownerInfoData.filter((info) => info !== null));
      //   console.log("Fetched owner info", ownerInfoData);
    } catch (error) {
      console.error("Error fetching request and owner info:", error);
    }
  };

  //   const updateInquiry_tatus = () => {
  //     // sending request to update to the inquiery status
  //     const requestsResponse = await fetch(
  //       `${apiURL}/appuser/${userInfo?.user_id}/inquiry?is_sitter=true`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${idToken}`, // Include the auth token
  //         },
  //       }
  //     );
  //   };

  useEffect(() => {
    fetchAll();
    console.log(requests);
  }, [userInfo]);

  useEffect(() => {
    if (requests && requests.length > 0) {
      console.log("Requests updated:", requests);
    } else {
      console.log("No request available");
    }
  }, [requests]); // This will run every time `bookings` changes.

  const desired_service = {
    owner_house: "boarding",
    sitter_house: "stay in",
    visit: "drop in",
  };

  return (
    <div>
      <h2 className="mx-6 mb-2 font-bold text-2xl">
        {t("dashboard_requests_page.title")}
      </h2>
      <div className="flex flex-col">
        {requests?.map((request, index) => (
          <div className="mx-6 my-2 border border-transparent shadow-custom rounded w-72 px-4 py-2 relative">
            <h3 className="text-sm font-medium my-1">
              {/* Booked with {sitterInfo[index]?.firstname} */}
              Requested by Laurence
            </h3>
            <p className="text-xs text-gray-500 my-1">
              {request.start_date.replaceAll("-", "/")} -{" "}
              {request.end_date.replaceAll("-", "/")}
            </p>
            <p className="text-xs text-gray-500 my-1">
              {desired_service[request.desired_service]}
            </p>
            <p className="text-xs text-gray-500 my-1">
              {request.inquiry_status}
            </p>
            <p className="text-xs underline my-1 cursor-pointer hover:text-lime-600">
              {t("dashboard_bookings_page.review")}
            </p>
            <div className="absolute top-4 right-4 hover:text-lime-600">
              <FaRegMessage />
            </div>
            <div>
              <button
                // onClick={() => updateInquiry_tatus())}
                className="my-2 shadow bg-green-500 hover:bg-green-600 focus:shadow-outline focus:outline-none text-white font-bold py-1 px-2 rounded text-sm"
              >
                Approve
              </button>
              <button
                // onClick={() => updateInquiry_tatus())}
                className="m-2 shadow bg-green-500 hover:bg-green-600 focus:shadow-outline focus:outline-none text-white font-bold py-1 px-2 rounded text-sm"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardRequests;
