import React from "react";
import { AppUser } from "../../types/userProfile";
import Modal from "./Modal";
import { MdClose } from "react-icons/md";
import { useTranslation } from "react-i18next";

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: AppUser;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user }) => {
  const { t } = useTranslation();

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
          <div className="p-6 max-h-screen overflow-y-auto">
            <button
              onClick={onClose}
              className="float-right text-gray-500 hover:text-gray-700"
              aria-label="Close modal"
            >
              <MdClose size={24} />
            </button>
            <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
            <div className="flex flex-col items-center">
              {user.profile_picture_src ? (
                <img
                  src={user.profile_picture_src}
                  alt={`${user.firstname} ${user.lastname}`}
                  className="w-24 h-24 rounded-full mb-4 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-300 mb-4 flex items-center justify-center">
                  <span className="text-xl text-white">
                    {user.firstname.charAt(0)}
                    {user.lastname.charAt(0)}
                  </span>
                </div>
              )}
              <p className="text-lg font-medium">
                {user.firstname} {user.lastname}
              </p>
              <p className="text-gray-600 mb-4">{user.email}</p>
            </div>
            {/* Add more profile details as needed */}
            {user.profile_bio && (
              <div className="mt-4">
                <h3 className="text-xl font-semibold mb-2">About</h3>
                <p>{user.profile_bio}</p>
              </div>
            )}
          </div>
        </Modal>
      );
};

export default UserProfileModal;