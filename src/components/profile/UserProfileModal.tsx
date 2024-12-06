import React from "react";
import { AppUser } from "../../types/userProfile";
import Modal from "./Modal";
import { MdClose } from "react-icons/md";
import Rating from "@mui/material/Rating";

interface UserProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: AppUser;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose, user }) => {

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
        </Modal>
      );
};

export default UserProfileModal;