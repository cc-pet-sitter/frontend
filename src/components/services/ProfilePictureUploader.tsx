import React, { useState, useRef } from "react";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { FaEdit } from "react-icons/fa";

interface ProfilePictureUploaderProps {
  id: number | undefined;
  pictureType: PictureType;
  onUpload: (url: string) => void;
}

type PictureType = "user_profile_pictures" | "sitter_pictures" | "pet_pictures";

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({
  id,
  pictureType,
  onUpload,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Check file type
      if (!selectedFile.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }
      // Check file size (e.g., limit to 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB.");
        return;
      }
      handleUpload(selectedFile);
    }
  };

  const handleUpload = (fileToUpload: File) => {
    setIsUploading(true);

    const uniqueFileName = `${Date.now()}_${id}`;
    const storageRef = ref(storage, `${pictureType}/${uniqueFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progressValue);
      },
      (error) => {
        console.error("Upload failed: ", error);
        setIsUploading(false);
        alert("Upload failed. Please try again.");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onUpload(downloadURL);
          setIsUploading(false);
          setProgress(0);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        });
      }
    );
  };

  return (
    <div className="flex flex-col items-center">

      {/* Edit Photo Button */}
      <button
        type="button"
        onClick={handleEditClick}
        className="btn-secondary mt-2 flex items-center"
        disabled={isUploading}
      >
        <FaEdit className="mr-2" />
        {isUploading ? "Uploading..." : "Edit Photo"}
      </button>

      {/* Hidden File Input */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload Progress Indicator */}
      {isUploading && progress > 0 && (
        <div className="mt-2 w-full">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-prBtnBg h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-1 text-sm text-brown">{progress.toFixed(0)}%</p>
        </div>
      )}
    </div>
  );
};

export default ProfilePictureUploader;