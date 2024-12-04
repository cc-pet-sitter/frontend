// src/components/AvailabilityManager.tsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Calendar } from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { MdUpdate } from "react-icons/md";
import "react-multi-date-picker/styles/colors/yellow.css";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

interface Availability {
  id: number | null;
  date: Date;
}

const AvailabilityManager: React.FC = () => {
  const { userInfo } = useAuth();
  const { t } = useTranslation();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [originalAvailabilities, setOriginalAvailabilities] = useState<
    Availability[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!userInfo) return;
      if (!userInfo.is_sitter) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `${apiURL}/appuser/${userInfo.id}/availability`
        );
        if (response.status === 200) {
          const data = response.data.map(
            (item: { id: number; available_date: string }) => ({
              id: item.id,
              date: new Date(item.available_date),
            })
          );
          setAvailabilities(data);
          setOriginalAvailabilities(data);
        }
      } catch (error) {
        console.error("Error fetching availabilities:", error);
        setError(t("failed_to_fetch_availabilities"));
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, [userInfo, t]);

  const handleDateChange = (dates: DateObject[]) => {
    const updatedAvailabilities = dates.map((dateObj) => {
      const date = dateObj.toDate();
      const existing = availabilities.find(
        (item) => item.date.toDateString() === date.toDateString()
      );
      return existing || { id: null, date };
    });
    setAvailabilities(updatedAvailabilities);
  };

  const handleSave = async () => {
    if (!userInfo) return;
    setLoading(true);
    try {
      const addedDates = availabilities.filter((item) => item.id === null);

      const removedAvailabilities = originalAvailabilities.filter(
        (origItem) =>
          !availabilities.some(
            (item) => item.date.toDateString() === origItem.date.toDateString()
          )
      );

      // Create new availabilities
      if (addedDates.length > 0) {
        const availabilityData = addedDates.map((item) => ({
          available_date: item.date.toISOString().split("T")[0],
        }));

        await axiosInstance.post(
          `${apiURL}/appuser/${userInfo.id}/availability`,
          availabilityData
        );
      }

      // Delete removed availabilities
      for (const item of removedAvailabilities) {
        await axiosInstance.delete(`${apiURL}/availability/${item.id}`);
      }

      // Refresh availabilities
      const response = await axiosInstance.get(
        `${apiURL}/appuser/${userInfo.id}/availability`
      );
      if (response.status === 200) {
        const data = response.data.map(
          (item: { id: number; available_date: string }) => ({
            id: item.id,
            date: new Date(item.available_date),
          })
        );
        setAvailabilities(data);
        setOriginalAvailabilities(data);
      }

      // Show success message
      setSuccess(true);
      setError(null);
    } catch (error) {
      console.error("Error updating availabilities:", error);
      if (!userInfo.is_sitter) {
        setError(t("You need to save your profile first before updating availabilities"));
        return;
      }  
      setError(t("failed_to_update_availabilities"));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 -z-50">
      <label className="block tracking-wide text-gray-700 font-bold mb-2 mt-4 text-lg">
        {t("dashboard_Sitter_Profile_page.availability")}
      </label>
      {loading ? (
        <p>{t("Loading")}...</p>
      ) : (
        <>
          <Calendar
            multiple
            value={availabilities.map((item) => item.date)}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            minDate={new Date()}
            numberOfMonths={1} // Optional: Displays two months side by side
            className="rmdp-mobile yellow"
            sort
          />
          <div className="flex justify-center md:justify-end mt-4">
            <button
              onClick={handleSave}
              className="flex items-center btn-primary focus:shadow-outline focus:outline-none font-semibold py-1 px-3 text-sm rounded w-auto mt-4"
            >
              <MdUpdate className="mr-1" size={20} />
              {t("dashboard_Sitter_Profile_page.update_availability")}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
          {success && (
            <p className="text-green-500 text-xs italic mt-2">
              {t("Availabilities updated successfully!")}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default AvailabilityManager;
