import React, { useState } from "react";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FaEdit } from "react-icons/fa";

interface ProfilePictureUploaderProps {
    id : number | undefined;
    pictureType: PictureType;
    onUpload: (url: string) => void;
    existingPictureUrl?: string;
}

type PictureType = "user_profile_pictures" | "sitter_pictures" | "pet_pictures";

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({ 
  id, 
  pictureType, 
  onUpload, 
  existingPictureUrl 
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const [isEditing, setIsEditing] = useState<boolean>(false);


    const handleUpload = () => {
        if (!file) {
            alert("No file selected");
            return;
        }

        const storageRef = ref(storage, `${pictureType}/${id}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
            },
            (error) => {
                console.error("Upload failed: ", error);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref)
                    .then((downloadURL) => {
                        onUpload(downloadURL);
                        setIsEditing(false);
                        setProgress(0);
                        setFile(null);
                    });
            }
        );
    };

    return (
        <div className="flex flex-col items-center">
          {existingPictureUrl && !isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="btn-secondary mt-2 flex items-center"
            >
              <FaEdit className="mr-2" />
              Edit Photo
            </button>
          ) : (
            <div className="flex flex-col items-center">
              <label className="btn-secondary cursor-pointer">
                Choose File
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>
              {file && (
                <p className="mt-2 text-sm text-brown">
                  Selected file: {file.name}
                </p>
              )}
              <div className="flex space-x-2 mt-2">
                <button
                  type="button"
                  onClick={handleUpload}
                  className="btn-primary"
                >
                  Upload
                </button>
                {existingPictureUrl && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                )}
              </div>
              {progress > 0 && (
                <p className="mt-2 text-sm text-brown">
                  Upload Progress: {progress.toFixed(2)}%
                </p>
              )}
            </div>
          )}
        </div>
    );
};
    
export default ProfilePictureUploader;