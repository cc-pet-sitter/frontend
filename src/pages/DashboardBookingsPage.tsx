import React from "react";
import { FaRegMessage } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const DashboardBookingsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h2 className="mx-6 mb-2 font-bold text-2xl">
        {t("dashboard_bookings_page.title")}
      </h2>
      <div className="flex flex-col">
        <div className="mx-6 my-2 border border-transparent shadow-custom rounded w-72 px-4 py-2 relative">
          <h3 className="text-sm font-medium my-1">Booked with Honoka</h3>
          <p className="text-xs text-gray-500 my-1">2024/10/20 - 2024/10/22</p>
          <p className="text-xs text-gray-500 my-1">Overnight Stay / Dog</p>
          <p className="text-xs text-gray-500 my-1">Confirmed</p>
          <p className="text-xs underline my-1 cursor-pointer hover:text-lime-600">
            {t("dashboard_bookings_page.review")}
          </p>
          <div className="absolute top-4 right-4 hover:text-lime-600">
            <FaRegMessage />
          </div>
        </div>
        <div className="mx-6 my-2 border border-transparent shadow-custom rounded w-72 px-4 py-2 relative">
          <h3 className="text-sm font-medium my-1">Booked with Honoka</h3>
          <p className="text-xs text-gray-500 my-1">2024/10/20 - 2024/10/22</p>
          <p className="text-xs text-gray-500 my-1">Overnight Stay / Dog</p>
          <p className="text-xs text-gray-500 my-1">Confirmed</p>
          <p className="text-xs underline my-1 cursor-pointer hover:text-lime-600">
            {t("dashboard_bookings_page.review")}
          </p>
          <div className="absolute top-4 right-4 hover:text-lime-600">
            <FaRegMessage />
          </div>
        </div>
        <div className="mx-6 my-2 border border-transparent shadow-custom rounded w-72 px-4 py-2 relative">
          <h3 className="text-sm font-medium my-1">Booked with Honoka</h3>
          <p className="text-xs text-gray-500 my-1">2024/10/20 - 2024/10/22</p>
          <p className="text-xs text-gray-500 my-1">Overnight Stay / Dog</p>
          <p className="text-xs text-gray-500 my-1">Confirmed</p>
          <p className="text-xs underline my-1 cursor-pointer hover:text-lime-600">
            {t("dashboard_bookings_page.review")}
          </p>
          <div className="absolute top-4 right-4 hover:text-lime-600">
            <FaRegMessage />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardBookingsPage;
