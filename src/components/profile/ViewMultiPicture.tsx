import React from "react";

interface ViewMultiPictureProps {
    picture_src_list: string | null;
}

const ViewMultiPicture: React.FC<ViewMultiPictureProps> = ({ picture_src_list }) => {
    const pictureList = picture_src_list ? picture_src_list.split(',') : [];

    return (
        <div className="flex flex-wrap">
        {pictureList.map((url, index) => (
            <img
                key={index}
                src={url}
                alt={`Picture ${index}`}
                className="h-32 w-32 object-cover m-2"
            />
        ))}
        </div>
    )
}

export default ViewMultiPicture;