import { useState } from "react";
import { useTranslation } from "react-i18next";

const NoticeBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div className="fixed top-12 left-0 w-full bg-yellow-200 text-yellow-800 p-4 h-auto z-50 flex flex-wrap items-center justify-between md:justify-center">
      {/* Centered Text */}
      <p className="text-sm sm:text-base flex-1 text-center md:px-4">
        {t("noticeBanner.message")}
      </p>
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="text-yellow-800 font-bold text-lg ml-4 md:ml-0 md:absolute md:right-4"
      >
        ✕
      </button>
    </div>
  );
};

export default NoticeBanner;
