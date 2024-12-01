import React, { useState, useEffect } from "react";
import { FaRegMessage } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { Inquiry, AppUser } from "../types/userProfile";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const DashboardRequests: React.FC = () => {
  const [requests, setRequests] = useState<Array<Inquiry> | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<Array<AppUser> | null>(null);
  const { t } = useTranslation();
  const { userInfo, currentUser } = useAuth();

  const fetchAll = async () => {
    try {
      const idToken = await currentUser?.getIdToken();

      if (!userInfo?.id) {
        console.error("User information is missing!");
        return;
      }

      const requestsResponse = await fetch(
        `${apiURL}/appuser/${userInfo?.id}/inquiry?is_sitter=true`,
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

      const ownerNamePromises = fetchRequests.map((request: Inquiry) => {
        return fetch(`${apiURL}/appuser/${request.owner_appuser_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });
      });

      const ownerResponses = await Promise.all(ownerNamePromises);

      const ownerInfoPromises = ownerResponses.map(async (response, index) => {
        if (!response.ok) {
          console.error(
            `Error with sitter info request ${index + 1} : ${response.status}`
          );
          return null;
        }
        const json = await response.json();
        return json;
      });

      const ownerInfoData = await Promise.all(ownerInfoPromises);

      setOwnerInfo(ownerInfoData.filter((info) => info !== null));
      console.log("Fetched owner info", ownerInfoData);
    } catch (error) {
      console.error("Error fetching request and owner info:", error);
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
        {t("dashboard_requests_page.title")}
      </h2>
      {requests ? (
        <div className="flex flex-col">
          {requests &&
            ownerInfo &&
            requests.map((request, index) => (
              <div
                key={index}
                className="mx-6 my-3 border border-transparent shadow-custom rounded w-72 px-4 py-2 relative"
              >
                <h3 className="text-sm font-medium my-1">
                  {t("dashboard_requests_page.requested_by_en")}{" "}
                  {ownerInfo[index].firstname}
                  {t("dashboard_requests_page.requested_by_jp")}
                </h3>
                <p className="text-xs text-gray-500 my-1">
                  {new Date(request.start_date).toLocaleDateString("ja-JP")} -{" "}
                  {new Date(request.end_date).toLocaleDateString("ja-JP")}
                </p>
                <p className="text-xs text-gray-500 my-1">
                  {
                    desired_service[
                      request.desired_service as keyof typeof desired_service
                    ]
                  }
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
                    className="m-2 shadow bg-red-500 hover:bg-red-600 focus:shadow-outline focus:outline-none text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
        </div>
      ) : (
        <p className="mx-6 mb-2">{t("dashboard_requests_page.no_requests")}</p>
      )}
    </div>
  );
};

export default DashboardRequests;