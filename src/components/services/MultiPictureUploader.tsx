import React, { useState } from "react";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import {styled } from '@mui/material/styles';

interface ProfilePictureUploaderProps {
    id: number | undefined;
    pictureType: PictureType;
    onUpload: (urls: string[]) => void; // callback with an array of uploaded file URLs
}

type PictureType = "user_profile_pictures" | "sitter_pictures" | "pet_pictures";

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({ id, pictureType, onUpload }) => {
    const [files, setFiles] = useState<File[]>([]); // Track selected files
    const [progress, setProgress] = useState<Record<string, number>>({}); // Progress for each file

    const handleFileChange = (fileList: FileList | null) => {
        if (!fileList) {
            alert("No files selected");
            return;
        }

        setFiles(Array.from(fileList)); // Convert FileList to an array and store it in state
    };

    const handleUpload = () => {
        if (files.length === 0) {
            alert("No files to upload");
            return;
        }

        const urls: string[] = [];
        files.forEach((file) => {
            const uniqueFileName = `${Date.now()}_${file.name}`;
            const filePath = `${pictureType}/${id}/${uniqueFileName}`;
            const storageRef = ref(storage, filePath);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progressValue = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress((prev) => ({ ...prev, [file.name]: progressValue }));
                },
                (error) => {
                    console.error(`Upload failed for file: ${file.name}`, error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        urls.push(downloadURL);
                        if (urls.length === files.length) {
                            onUpload(urls); // Call onUpload after all files are uploaded
                            setFiles([]);
                            setProgress({});
                        }
                    });
                }
            );
        });
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });

    return (
        <div>
            < Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CloudUploadIcon />}
                className="btn-secondary"
            >
                Select files
                < VisuallyHiddenInput
                    type="file"
                    onChange={(e) => handleFileChange(e.target.files)}
                    multiple
                />
            </Button>
            {files.length > 0 && (
                <div className="mt-2">
                    <button
                        type="button"
                        onClick={handleUpload}
                        className="btn-primary"
                    >
                        Upload Files
                    </button>
                    <div className="mt-2">
                        {files.map((file) => (
                        <p key={file.name}>
                            {file.name}: {progress[file.name]?.toFixed(2) || 0}%
                        </p>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePictureUploader;