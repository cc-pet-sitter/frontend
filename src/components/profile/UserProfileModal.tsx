import React from "react";
import { AppUser, PetProfileData } from "../../types/userProfile";
import Modal from "./Modal";
import { MdClose } from "react-icons/md";
import Rating from "@mui/material/Rating";
import { useTranslation } from "react-i18next";

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user?: AppUser;
    pet?: PetProfileData;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user, pet }) => {
  const { t } = useTranslation();

    return (
      <>
        {user && <Modal isOpen={isOpen} onClose={onClose}>
          <div className="p-6 max-h-screen overflow-y-auto">
            <button
              onClick={onClose}
              className="float-right text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <MdClose size={24} />
            </button>
            <div className="flex flex-col items-center gap-1">
              {user.profile_picture_src ? (
                <img
                  src={user.profile_picture_src}
                  alt={`${user.firstname} ${user.lastname}`}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xl text-white">
                    {user.firstname.charAt(0)}
                    {user.lastname.charAt(0)}
                  </span>
                </div>
              )}
              <p className="text-xl font-semibold">
                {user.firstname} {user.lastname}
              </p>
              <Rating name="read-only" value={user.average_user_rating ? user.average_user_rating : 0} readOnly />
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600">{user.prefecture}, {user.city_ward}</p>
            </div>
          </div>
        </Modal>}
        {pet && <Modal isOpen={isOpen} onClose={onClose}>
          <div className="p-6 max-h-screen overflow-y-auto">
            <button
              onClick={onClose}
              className="float-right text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <MdClose size={24} />
            </button>
            <div className="flex flex-col items-center gap-1">
              {pet.profile_picture_src ? (
                <img
                  src={pet.profile_picture_src}
                  alt={`${pet.name}`}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xl text-white">
                    {pet.name[0]}
                  </span>
                </div>
              )}
              <p className="text-xl font-semibold">
                {`${pet.name} (${t(`searchBar.petOptions.${pet.type_of_animal}`)})`}
              </p>
              {pet.subtype && <p className="text-gray-600 text-center">{`${t("editPetProfileForm.breed")}: ${pet.subtype}`}</p>}
              {pet.gender && <p className="text-gray-600 text-center">{`${t("editPetProfileForm.gender")}: ${pet.gender}`}</p>}
              {pet.birthday && <p className="text-gray-600" text-center>{`${t("editPetProfileForm.birthday")}: ${pet.birthday}`}</p>}
              {pet.weight && <p className="text-gray-600 text-center">{`${t("editPetProfileForm.weight")}: ${pet.weight}`}</p>}
              {pet.known_allergies && <p className="text-gray-600 text-center">{`${t("PetProfile.allergies")}: ${pet.known_allergies}`}</p>}
              {pet.medications && <p className="text-gray-600 text-center">{`${t("editPetProfileForm.medications")}: ${pet.medications}`}</p>}
              {pet.special_needs && <p className="text-gray-600 text-center">{`${t("PetProfile.specialNeeds")}: ${pet.special_needs}`}</p>}
            </div>
          </div>
        </Modal>}
      </>
    );
};

export default UserProfileModal;