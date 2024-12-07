import React from "react";
import { Calendar } from "react-multi-date-picker";
import { useTranslation } from "react-i18next";
import "react-multi-date-picker/styles/colors/yellow.css";

interface ViewAvailabilityProps {
  availabilities: Date[];
}

const ViewAvailability: React.FC<ViewAvailabilityProps> = ({
  availabilities,
}) => {
  const { t } = useTranslation();

  return (
    <div className="p-6 border-t">
      <h2 className="text-lg font-bold mb-4">
        {t("sitterProfilePage.availability")}
      </h2>
      {availabilities.length === 0 ? (
        <p className="text-center text-gray-500">{t("sitterProfilePage.noAvailabilities")}</p>
      ) : (
        <div className="flex justify-center">
          <Calendar
            value={availabilities}
            readOnly
            multiple
            format="YYYY-MM-DD"
            sort
            className="yellow"
            numberOfMonths={1}
            minDate={new Date()}
            mapDays={({ date }) => {
              const isSelected = availabilities.some(
                (availDate) =>
                  availDate.toDateString() === date.toDate().toDateString()
              );
              if (isSelected)
                return {
                  className: "bg-mugi-500 text-white rounded-full",
                };
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ViewAvailability;
