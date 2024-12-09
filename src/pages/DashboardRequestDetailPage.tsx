import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Inquiry, AppUser, PetProfileData } from "../types/userProfile";
import Conversation from "../components/chat/Conversation";
import UserProfileModal from "../components/profile/UserProfileModal";
import Modal from "../components/profile/Modal";
import { useTranslation } from "react-i18next";
import { MdOutlineArrowBackIos } from "react-icons/md";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const DashboardRequestDetailPage: React.FC = () => {
  const [request, setRequest] = useState<Inquiry | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<AppUser | null>(null);
  const [sitterInfo, setSitterInfo] = useState<AppUser | null>(null);
  const [petInfo, setPetInfo] = useState<PetProfileData[]>([]);
  const [error, setError] = useState<string | null>(null);

  // State for User/Pet profile modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<AppUser | null>(null);
  const [selectedPet, setSelectedPet] = useState<PetProfileData | null>(null);

  // State for confirmation modal (accept/reject)
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [modalAction, setModalAction] = useState<"accept" | "reject" | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { from } = location.state || { from: null };

  const { currentUser, userInfo } = useAuth();
  const { requestId } = useParams<{ requestId: string }>();
  const { t } = useTranslation();

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

        // Fetch pet info
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
        setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      }
    };

    fetchRequestDetails();
  }, [currentUser, requestId]);

  const handleGoBack = () => {
    if (from === "bookings") {
      navigate("/dashboard/bookings");
    } else if (from === "requests") {
      navigate("/dashboard/requests");
    } else {
      navigate(-1);
    }
  };

  const handleUserClick = (user: AppUser) => {
    setSelectedUser(user);
    setSelectedPet(null);
    setIsProfileModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handlePetClick = (pet: PetProfileData) => {
    setSelectedUser(null);
    setSelectedPet(pet);
    setIsProfileModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const openConfirmModal = (action: "accept" | "reject") => {
    setModalAction(action);
    setIsConfirmModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeConfirmModal = () => {
    setModalAction(null);
    setIsConfirmModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const confirmAction = async () => {
    if (!modalAction || !requestId) return;

    try {
      const idToken = await currentUser?.getIdToken();
      const endpoint = `${apiURL}/inquiry/${requestId}`;
      const body = JSON.stringify({
        inquiry_status: modalAction === "accept" ? "approved" : "rejected",
      });

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to ${modalAction} the request`);
      }

      if (request) {
        setRequest({
          ...request,
          inquiry_status: modalAction === "accept" ? "approved" : "rejected",
        });
      }
      closeConfirmModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      closeConfirmModal();
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!request || !ownerInfo || !sitterInfo) {
    return <p>Loading...</p>;
  }

  // Determine user role
  const isOwner = userInfo?.id === request?.owner_appuser_id;
  const isSitter = userInfo?.id === request?.sitter_appuser_id;

  return (
    <div className="p-6 md:mx-20">
      {/* Go Back Button */}
      <button
        onClick={handleGoBack}
        className="flex items-center hover:text-orange-700 mb-4"
      >
        <MdOutlineArrowBackIos className="mr-2" />
        {t("request_details_page.goBack")}
      </button>

      <div className="md:flex md:justify-start pd">
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
              className="flex w-4/5 md:w-2/3 items-center gap-4 cursor-pointer mb-4 rounded-xl p-2 pl-4 bg-white shadow-custom hover:bg-gray-100"
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
              <p>{ownerInfo.firstname} {ownerInfo.lastname}</p>
            </div>
          )}

          {/* Sitter Information */}
          {isOwner && sitterInfo && (
            <div
              className="flex items-center w-4/5 md:w-2/3 gap-4 mb-4 shadow-custom rounded-xl p-2 pl-4 bg-white cursor-pointer hover:bg-gray-100"
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
              <p>{sitterInfo.firstname} {sitterInfo.lastname}</p>
            </div>
          )}

          {/* Pet Information */}
          {petInfo && petInfo.map((pet) => (
            request?.pet_id_list?.includes(pet.id) && (
              <div
                className="flex items-center w-4/5 md:w-2/3 gap-4 mb-4 rounded-xl p-2 pl-4 bg-white shadow-custom cursor-pointer hover:bg-gray-100"
                onClick={() => handlePetClick(pet)}
                key={pet.id}
              >
                {pet.profile_picture_src ? (
                  <img
                    src={pet.profile_picture_src}
                    alt={pet.name}
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
                  {`${pet.name} (${t(`searchBar.petOptions.${pet.type_of_animal}`)})`}
                </p>
              </div>
            )
          ))}

          {/* Confirm Actions (Accept/Reject) */}
          {isSitter && request.inquiry_status === "requested" && (
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => openConfirmModal("accept")}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                {t("request_details_page.accept")}
              </button>
              <button
                onClick={() => openConfirmModal("reject")}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                {t("request_details_page.reject")}
              </button>
            </div>
          )}
        </div>

        {/* Conversation Component */}
        <div className="mt-6 md:mt-2 md:w-1/2 md:p-8">
          <h3 className="font-semibold text-xl my-4">
            {t("request_details_page.convo")}
          </h3>
          {userInfo?.id && <Conversation inquiry={request} />}
        </div>
      </div>

      {/* User or Pet Profile Modal */}
      {(selectedUser || selectedPet) && (
        <UserProfileModal
          isOpen={isProfileModalOpen}
          user={selectedUser || undefined}
          pet={selectedPet || undefined}
          onClose={() => {
            setIsProfileModalOpen(false);
            setSelectedUser(null);
            setSelectedPet(null);
            document.body.style.overflow = 'auto';
          }}
        />
      )}

      {/* Confirmation Modal for Accept/Reject */}
      <Modal isOpen={isConfirmModalOpen} onClose={closeConfirmModal}>
        <div className="p-6 text-center">
          <h2 className="text-lg font-semibold mb-4">
            {modalAction === "accept"
              ? t("request_details_page.confirm-accept")
              : t("request_details_page.confirm-reject")}
          </h2>
          <div className="flex justify-center space-x-4 mt-4">
            <button
              onClick={confirmAction}
              className="btn-primary text-white font-bold py-2 px-4 rounded"
            >
              {t("request_details_page.modalConfirm")}
            </button>
            <button
              onClick={closeConfirmModal}
              className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
            >
              {t("request_details_page.modalCancel")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DashboardRequestDetailPage;