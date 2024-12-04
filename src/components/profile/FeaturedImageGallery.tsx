import React from "react";

interface FeaturedImageGalleryProps {
    picture_src_list: string | null;
}
const FeaturedImageGallery: React.FC<FeaturedImageGalleryProps> = ({picture_src_list}) => {
    const data = picture_src_list?.split(',');
      const [active, setActive] = React.useState(data?.[0]);
    
    return (
        <div className="grid gap-4">
        <div>
            <img
            className="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px]"
            src={active}
            alt=""
            />
        </div>
        <div className="grid grid-cols-5 gap-4">
            {(data && 
                data.map((image, index) => (
                    <div key={index}>
                        <img
                        onClick={() => setActive(image)}
                        src={image}
                        className="h-20 max-w-full cursor-pointer rounded-lg object-cover object-center"
                        alt="gallery-image"
                        />
                 </div>
                ))
            )}
        </div>
        </div>
    );
};
export default FeaturedImageGallery;