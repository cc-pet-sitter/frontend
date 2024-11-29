import React, { useState } from "react";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

interface ProfilePictureUploaderProps {
    id : number | undefined;
    pictureType: PictureType;
    onUpload: (url: string) => void;
}

type PictureType = "user_profile_pictures" | "sitter_pictures" | "pet_pictures";

const ProfilePictureUploader: React.FC<ProfilePictureUploaderProps> = ({ id, pictureType, onUpload }) => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<number>(0);

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
                    });
            }
        );
    };

    return (
        <div>
            <input 
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <button
                onClick={handleUpload}
            >
                Upload
            </button>
            {progress > 0 && <p>Progress: {progress.toFixed(2)}%</p>}
        </div>
    );
};

export default ProfilePictureUploader;