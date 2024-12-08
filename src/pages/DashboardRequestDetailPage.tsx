import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Inquiry, AppUser, PetProfileData } from "../types/userProfile";
import Conversation from "../components/chat/Conversation"; // We'll create this later
import UserProfileModal from "../components/profile/UserProfileModal";
import { useTranslation } from "react-i18next";
import { MdOutlineArrowBackIos } from "react-icons/md";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const DashboardRequestDetailPage: React.FC = () => {
  const [request, setRequest] = useState<Inquiry | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<AppUser | null>(null);
  const [sitterInfo, setSitterInfo] = useState<AppUser | null>(null);
  const [petInfo, setPetInfo] = useState<PetProfileData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [selectedPet, setSelectedPet] = useState<PetProfileData | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: null}
  
  const { currentUser, userInfo } = useAuth();
  const { requestId } = useParams<{ requestId: string }>();
  const { t } = useTranslation();

  const handleGoBack = () => {
    if (from === "bookings") {
      navigate("/dashboard/bookings");
    } else if (from === "requests") {
      navigate("/dashboard/requests");
    } else {
      navigate(-1); // Default: go back one page
    }
  };
  
  const handleUserClick = (user: AppUser) => {
    setSelectedUser(user);
    setSelectedPet(null);
    setIsModalOpen(true);
  };

  const handlePetClick = (pet: PetProfileData) => {
    setSelectedUser(null);
    setSelectedPet(pet);
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

        const petResponse = await fetch(
          `${apiURL}/appuser/${requestData.owner_appuser_id}/pet?inquiry_id=${requestData.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          }
        );

        if (!petResponse.ok) {
          throw new Error("Failed to fetch pet info");
        }

        const petData: PetProfileData[] = await petResponse.json();
        setPetInfo(petData);
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
    <div className="p-6 md:mx-20">
            {/* Go Back Button */}
      <button
        onClick={handleGoBack}
        className="flex items-center text-gray-500 hover:text-orange-700 mb-4"
      >
        <MdOutlineArrowBackIos className="mr-2" />
        {t("request_details_page.goBack")}
      </button>
      
      <div className="md:flex md:ustify-start pd">
        <div className="mt-2 md:w-1/2 md:p-8">
          {/* Request Information */}
          <div className="mb-6">
            <h3 className="font-semibold text-xl my-4">
              {t("request_details_page.section-title")}
            </h3>
            <p className="pb-2">
              <strong>{t("request_details_page.service")}</strong>{" "}
              {request.desired_service === "sitter_house" &&
                t("dashboard_Sitter_Profile_page.sitter_house")}
              {request.desired_service === "owner_house" &&
                t("dashboard_Sitter_Profile_page.owner_house")}
              {request.desired_service === "visit" &&
                t("dashboard_Sitter_Profile_page.visits")}
            </p>
            <p className="pb-2">
              <strong>{t("request_details_page.dates")}</strong>{" "}
              {new Date(request.start_date).toLocaleDateString()} -{" "}
              {new Date(request.end_date).toLocaleDateString()}
            </p>
            <p className="pb-2">
              <strong>{t("request_details_page.status")}</strong>{" "}
              {request.inquiry_status === "requested" &&
                t("request_details_page.requested")}
              {request.inquiry_status === "approved" &&
                t("request_details_page.approved")}
              {request.inquiry_status === "rejected" &&
                t("request_details_page.rejected")}
            </p>
            <p className="pb-2">
              <strong>{t("request_details_page.comment")}</strong>{" "}
              {request.additional_info}
            </p>
          </div>

          {/* Owner Information */}
          {isSitter && ownerInfo && (
            <div
              className="flex w-4/5 md:w-2/3 items-center gap-4 cursor-pointer mb-4 rounded-xl p-2 pl-4 bg-white shadow-custom  hover:bg-gray-100"
              onClick={() => handleUserClick(ownerInfo)}
            >
              {ownerInfo.profile_picture_src ? (
                <img
                  src={ownerInfo.profile_picture_src}
                  alt={`${ownerInfo.firstname} ${ownerInfo.lastname}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xl text-white">
                    {ownerInfo.firstname.charAt(0)}
                    {ownerInfo.lastname.charAt(0)}
                  </span>
                </div>
              )}
              <p>
                {ownerInfo.firstname} {ownerInfo.lastname}
              </p>
            </div>
          )}

          {/* Sitter Information */}
          {isOwner && sitterInfo && (
            <div
              className="flex items-center w-4/5 md:w-2/3 gap-4 mb-4 shadow-custom  rounded-xl p-2 pl-4  bg-white cursor-pointer hover:bg-gray-100"
              onClick={() => handleUserClick(sitterInfo)}
            >
              {sitterInfo.profile_picture_src ? (
                <img
                  src={sitterInfo.profile_picture_src}
                  alt={`${sitterInfo.firstname} ${sitterInfo.lastname}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xl text-white">
                    {sitterInfo.firstname.charAt(0)}
                    {sitterInfo.lastname.charAt(0)}
                  </span>
                </div>
              )}
              <p>
                {sitterInfo.firstname} {sitterInfo.lastname}
              </p>
            </div>
          )}

          {/* Pet Information */}
          {petInfo &&
            petInfo.map((pet) => {
              return (
                request?.pet_id_list?.includes(pet.id) && (
                  <div
                    className="flex items-center w-4/5 md:w-2/3 gap-4 mb-4 rounded-xl p-2 pl-4 bg-white shadow-custom cursor-pointer hover:bg-gray-100"
                    onClick={() => handlePetClick(pet)}
                    key={pet.id}
                  >
                    {pet.profile_picture_src ? (
                      <img
                        src={pet.profile_picture_src}
                        alt={`${pet.name}`}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xl text-white">
                          {pet.name[0]}
                        </span>
                      </div>
                    )}
                    <p>
                      {`${pet.name} (${t(
                        `searchBar.petOptions.${pet.type_of_animal}`
                      )})`}
                    </p>
                  </div>
                )
              );
            })}

          {/* User Profile Modal */}
          {isModalOpen && selectedUser && (
            <UserProfileModal
              isOpen={isModalOpen}
              user={selectedUser}
              onClose={() => setIsModalOpen(false)}
            />
          )}

          {/* Pet Profile Modal */}
          {isModalOpen && selectedPet && (
            <UserProfileModal
              isOpen={isModalOpen}
              pet={selectedPet}
              onClose={() => setIsModalOpen(false)}
            />
          )}

          {/* Accept/Reject Buttons */}
          {isSitter && request.inquiry_status === "requested" && (
            <div className="flex space-x-4 mt-6">
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
          {/* {request.inquiry_status !== "requested" && (
            <p className="text-lg font-semibold mt-4">
              {t("request_details_page.result")}
              {request.inquiry_status}
            </p>
          )} */}
        </div>

        {/* Conversation Component */}
        <div className="mt-6 md:mt-2 md:w-1/2 md:p-8">
          <h3 className="font-semibold text-xl my-4">
            {t("request_details_page.convo")}
          </h3>
          {userInfo?.id && <Conversation inquiry={request} />}
        </div>
      </div>
    </div>
  );
};

export default DashboardRequestDetailPage;
