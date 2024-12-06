import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Inquiry, AppUser } from "../types/userProfile";
import Conversation from "../components/chat/Conversation"; // We'll create this later
import UserProfileModal from "../components/profile/UserProfileModal";
import { useTranslation } from "react-i18next";
const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const DashboardRequestDetailPage: React.FC = () => {
  const [request, setRequest] = useState<Inquiry | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<AppUser | null>(null);
  const [sitterInfo, setSitterInfo] = useState<AppUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { currentUser, userInfo } = useAuth();
  const { requestId } = useParams<{ requestId: string }>();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);

  const { t } = useTranslation();

  const handleUserClick = (user: AppUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const idToken = await currentUser?.getIdToken();

        // Fetch request details
        const requestResponse = await fetch(`${apiURL}/inquiry/${requestId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!requestResponse.ok) {
          throw new Error("Failed to fetch request details");
        }

        const requestData: Inquiry = await requestResponse.json();
        setRequest(requestData);

        // Fetch owner info
        const ownerResponse = await fetch(
          `${apiURL}/appuser/${requestData.owner_appuser_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (!ownerResponse.ok) {
          throw new Error("Failed to fetch owner info");
        }

        const ownerData: AppUser = await ownerResponse.json();
        setOwnerInfo(ownerData);

        // Fetch sitter info
        const sitterResponse = await fetch(
          `${apiURL}/appuser/${requestData.sitter_appuser_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (!sitterResponse.ok) {
          throw new Error("Failed to fetch sitter info");
        }

        const sitterData: AppUser = await sitterResponse.json();
        setSitterInfo(sitterData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    };

    fetchRequestDetails();
  }, [currentUser, requestId]);

  // Determine user role
  const isOwner = userInfo?.id === request?.owner_appuser_id;
  const isSitter = userInfo?.id === request?.sitter_appuser_id;

  const handleAccept = async () => {
    if (window.confirm(t("request_details_page.confirm-accept"))) {
      try {
        const idToken = await currentUser?.getIdToken();

        const response = await fetch(`${apiURL}/inquiry/${requestId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ inquiry_status: "approved" }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to accept the request");
        }

        // Update local state
        setRequest({ ...request!, inquiry_status: "approved" });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    }
  };

  const handleReject = async () => {
    if (window.confirm(t("request_details_page.confirm-reject"))) {
      try {
        const idToken = await currentUser?.getIdToken();

        const response = await fetch(`${apiURL}/inquiry/${requestId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ inquiry_status: "rejected" }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Failed to reject the request");
        }

        // Update local state
        setRequest({ ...request!, inquiry_status: "rejected" });
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred.");
        }
      }
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!request || !ownerInfo || !sitterInfo) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="font-bold text-2xl mb-4">{t("request_details_page.page-title")}</h2>

      {/* Request Information */}
      <div className="mb-6">
        <h3 className="font-semibold text-xl">{t("request_details_page.section-title")}</h3>
        <p>
          <strong>{t("request_details_page.service")}</strong> {request.desired_service}
        </p>
        <p>
          <strong>{t("request_details_page.dates")}</strong>{" "}
          {new Date(request.start_date).toLocaleDateString()} -{" "}
          {new Date(request.end_date).toLocaleDateString()}
        </p>
        <p>
          <strong>{t("request_details_page.status")}</strong> {request.inquiry_status}
        </p>
        <p>
          <strong>{t("request_details_page.comment")}</strong> {request.additional_info}
        </p>
      </div>

      {/* Owner Information */}
      {isSitter && ownerInfo && (
        <div
          className="mb-6 cursor-pointermb-6 border rounded-lg p-4 bg-white shadow-md cursor-pointer hover:bg-gray-100"
          onClick={() => handleUserClick(ownerInfo)}
        >
          <h3 className="font-semibold text-xl">{t("request_details_page.owner-title")}</h3>
          {ownerInfo.profile_picture_src ? (
                <img
                  src={ownerInfo.profile_picture_src}
                  alt={`${ownerInfo.firstname} ${ownerInfo.lastname}`}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
                  <span className="text-xl text-white">
                    {ownerInfo.firstname.charAt(0)}
                    {ownerInfo.lastname.charAt(0)}
                  </span>
                </div>
              )}
          <p>
            <strong>{t("request_details_page.name")}</strong> {ownerInfo.firstname} {ownerInfo.lastname}
          </p>
          <p>
            <strong>{t("request_details_page.email")}</strong> {ownerInfo.email}
          </p>
          {/* Add more owner details as needed */}
          <p className="text-blue-500 mt-2">{t("request_details_page.tap")}</p>
        </div>
      )}

      {/* Sitter Information */}
      {isOwner && sitterInfo && (
        <div
          className="mb-6 border rounded-lg p-4 bg-white shadow-md cursor-pointer hover:bg-gray-100"
          onClick={() => handleUserClick(sitterInfo)}
        >
          <h3 className="font-semibold text-xl">t("request_details_page.sitter-title")</h3>
          {sitterInfo.profile_picture_src ? (
                <img
                  src={sitterInfo.profile_picture_src}
                  alt={`${sitterInfo.firstname} ${sitterInfo.lastname}`}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
                  <span className="text-xl text-white">
                    {sitterInfo.firstname.charAt(0)}
                    {sitterInfo.lastname.charAt(0)}
                  </span>
                </div>
              )}
          <p>
            <strong>{t("request_details_page.name")}</strong> {sitterInfo.firstname} {sitterInfo.lastname}
          </p>
          <p>
            <strong>{t("request_details_page.email")}</strong> {sitterInfo.email}
          </p>
          {/* Add more sitter details as needed */}
          <p className="text-blue-500 mt-2">{t("request_details_page.tap")}</p>
        </div>
      )}

      {/* User Profile Modal */}
      {isModalOpen && selectedUser && (
        <UserProfileModal
          isOpen={isModalOpen}
          user={selectedUser}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Accept/Reject Buttons */}
      {isSitter && request.inquiry_status === "requested" && (
        <div className="flex space-x-4 mb-6">
          <button
            onClick={handleAccept}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            {t("request_details_page.accept")}
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            {t("request_details_page.reject")}
          </button>
        </div>
      )}

      {/* Show updated status if the inquiry has been finalized */}
      {request.inquiry_status !== "requested" && (
        <p className="text-lg font-semibold mb-6">
          {t("request_details_page.result")}{request.inquiry_status}
        </p>
      )}

      {/* Conversation Component */}
      <div className="mb-6">
        <h3 className="font-semibold text-xl">{t("request_details_page.convo")}</h3>
        {userInfo?.id && <Conversation inquiry={request} />}
      </div>
    </div>
  );
};

export default DashboardRequestDetailPage;
