import React, {useState} from "react";
import { useTranslation } from "react-i18next";

interface FeaturedImageGalleryProps {
    picture_src_list: string | null;
}
const FeaturedImageGallery: React.FC<FeaturedImageGalleryProps> = ({picture_src_list}) => {
    const data = picture_src_list ? picture_src_list.split(",") : [];
    const [active, setActive] = useState(data.length > 0 ? data[0] : null);
    const { t } = useTranslation();
    
    return (
        <div className="grid gap-4">
          {/* Main Active Image */}
          <div>
            {active ? (
              <img
                className="h-auto w-full max-w-full rounded-lg object-cover object-center md:h-[480px]"
                src={active}
                alt="Featured"
              />
            ) : (
              <p className="text-left text-gray-500">{t("featuredImageGallery.noImages")}</p>
            )}
          </div>
    
          {/* Thumbnail Images */}
          {data.length > 0 && (
            <div className="grid grid-cols-5 gap-4">
              {data.map((image, index) => (
                <div key={index}>
                  <img
                    onClick={() => setActive(image)}
                    src={image}
                    className={`h-20 max-w-full cursor-pointer rounded-lg object-cover object-center ${
                      active === image ? "border-2 border-orange-500" : ""
                    }`}
                    alt={`gallery-thumbnail-${index}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      );
};
export default FeaturedImageGallery;