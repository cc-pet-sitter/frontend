import React, { useState, useEffect } from "react";
import { FaRegMessage } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useAuth } from "../contexts/AuthContext";
import { Inquiry, AppUser } from "../types/userProfile";
import { Link } from "react-router-dom";
import WriteReview from "../components/reviews/WriteReview";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const DashboardRequests: React.FC = () => {
  const [requests, setRequests] = useState<Array<Inquiry> | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<Array<AppUser> | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<Inquiry | null>(null);

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

  return (
    <div className="md:m-14">
      <h2 className="m-6 font-bold text-2xl">
        {t("dashboard_requests_page.title")}
      </h2>
      {requests ? (
        <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-x-2 md:gap-y-4 md:justify-stretch">
          {requests &&
            ownerInfo &&
            requests.map((request, index) => (
              <div
                key={index}
                className="mx-6 my-3 border border-transparent shadow-custom rounded w-72 px-4 py-2 relative"
              >
                <Link
                  to={`/dashboard/requests/${request.id}`}
                  state={{ from: "requests " }}
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
                    {t("dashboard_bookings_page.service")}
                    {request.desired_service === "sitter_house" &&
                      t("dashboard_Sitter_Profile_page.sitter_house")}
                    {request.desired_service === "owner_house" &&
                      t("dashboard_Sitter_Profile_page.owner_house")}
                    {request.desired_service === "visit" &&
                      t("dashboard_Sitter_Profile_page.visits")}
                  </p>
                  <p className="text-xs text-gray-500 my-1">
                    {t("dashboard_bookings_page.status")}
                    {request.inquiry_status === "requested" &&
                      t("request_details_page.requested")}
                    {request.inquiry_status === "approved" &&
                      t("request_details_page.approved")}
                    {request.inquiry_status === "rejected" &&
                      t("request_details_page.rejected")}
                  </p>
                  <div className="absolute top-4 right-4 hover:text-lime-600">
                    <FaRegMessage />
                  </div>
                </Link>
                {request.inquiry_status == "approved" ? (
                  <p
                    className="text-xs text-brown underline my-1 cursor-pointer hover:text-lime-600"
                    onClick={() => setSelectedRequest(request)}
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
        <p className="mx-6 mb-2">{t("dashboard_requests_page.no_requests")}</p>
      )}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <WriteReview
              booking={selectedRequest}
              onClose={() => setSelectedRequest(null)}
              recipientType="owner"
            />
            <div className="flex justify-center">
              <button
                onClick={() => setSelectedRequest(null)}
                className="mt-4 text-brown"
              >
                {t("dashboard_bookings_page.close_review")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardRequests;
