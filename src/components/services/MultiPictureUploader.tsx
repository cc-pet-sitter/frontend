import React, { useRef, useState } from "react";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { TailSpin } from "react-loader-spinner";
import { useTranslation } from "react-i18next";

interface MultiPictureUploaderProps {
  id: number | undefined;
  pictureType: PictureType;
  onUpload: (urls: string[]) => void; // callback with an array of uploaded file URLs
  existingPictureUrls?: string[];
}

type PictureType = "user_profile_pictures" | "sitter_pictures" | "pet_pictures";

const MultiPictureUploader: React.FC<MultiPictureUploaderProps> = ({
  id,
  pictureType,
  onUpload,
  existingPictureUrls = [],
}) => {
  const [, setUploadedUrls] = useState<string[]>(existingPictureUrls);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  const handleFileChange = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      alert("No files selected");
      return;
    }

    const filesArray = Array.from(fileList);
    setIsUploading(true);
    setUploadProgress(0);

    const urls: string[] = [];

    try {
      for (let i = 0; i < filesArray.length; i++) {
        const file = filesArray[i];
        const uniqueFileName = `${Date.now()}_${file.name}`;
        const filePath = `${pictureType}/${id}/${uniqueFileName}`;
        const storageRefInstance = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRefInstance, file);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              setUploadProgress(
                Math.round(
                  ((i + snapshot.bytesTransferred / snapshot.totalBytes) /
                    filesArray.length) *
                    100
                )
              );
            },
            (error) => {
              console.error(`Upload failed for file: ${file.name}`, error);
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                urls.push(downloadURL);
                resolve();
              });
            }
          );
        });
      }

      setUploadedUrls((prev) => [...prev, ...urls]);
      onUpload(urls);
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("Failed to upload some images. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="mt-4">
      {/* Add Photos Button */}
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        disabled={isUploading}
        className="btn-secondary"
        aria-label="Add Photos"
      >
        {isUploading
          ? t("PictureUploader.uploading")
          : t("PictureUploader.upload_photo")}
        <VisuallyHiddenInput
          type="file"
          onChange={(e) => handleFileChange(e.target.files)}
          multiple
          accept="image/*"
        />
      </Button>

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex items-center mt-2">
          <TailSpin
            height="20"
            width="20"
            color="#4F46E5"
            ariaLabel="loading"
          />
        </div>
      )}

      {/* Upload Progress Indicator */}
      {isUploading && uploadProgress > 0 && (
        <div className="mt-2 w-full">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-prBtnBg h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="mt-1 text-sm text-brown">
            {uploadProgress.toFixed(0)}%
          </p>
        </div>
      )}
    </div>
  );
};

export default MultiPictureUploader;
