// src/components/AvailabilityManager.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar } from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

interface Availability {
  id: number | null;
  date: Date;
}

const AvailabilityManager: React.FC = () => {
  const { userInfo } = useAuth();
  const { t } = useTranslation();
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [originalAvailabilities, setOriginalAvailabilities] = useState<Availability[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!userInfo) return;
      setLoading(true);
      try {
        const response = await axios.get(`${apiURL}/appuser/${userInfo.id}/availability`);
        if (response.status === 200) {
          const data = response.data.map((item: { id: number; available_date: string }) => ({
            id: item.id,
            date: new Date(item.available_date),
          }));
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
      const existing = availabilities.find((item) => item.date.toDateString() === date.toDateString());
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
        (origItem) => !availabilities.some((item) => item.date.toDateString() === origItem.date.toDateString())
      );

      // Create new availabilities
      if (addedDates.length > 0) {
        const availabilityData = addedDates.map((item) => ({
          available_date: item.date.toISOString().split("T")[0],
        }));

        await axios.post(`${apiURL}/appuser/${userInfo.id}/availability`, availabilityData);
      }

      // Delete removed availabilities
      for (const item of removedAvailabilities) {
        await axios.delete(`${apiURL}/availability/${item.id}`);
      }

      // Refresh availabilities
      const response = await axios.get(`${apiURL}/appuser/${userInfo.id}/availability`);
      if (response.status === 200) {
        const data = response.data.map((item: { id: number; available_date: string }) => ({
          id: item.id,
          date: new Date(item.available_date),
        }));
        setAvailabilities(data);
        setOriginalAvailabilities(data);
      }

      // Show success message
      setSuccess(true);
      setError(null);
    } catch (error) {
      console.error("Error updating availabilities:", error);
      setError(t("failed_to_update_availabilities"));
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="block tracking-wide text-gray-700 font-bold mb-2 mt-4 text-lg">
        {t("Select Your Available Dates")}
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
            className="shadow-md"
            sort
          />
          <div className="flex justify-center md:justify-end mt-4">
            <button
              onClick={handleSave}
              className="shadow bg-blue-500 hover:bg-blue-600 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 text-sm rounded w-full sm:w-auto"
            >
              {t("Save Availability")}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
          {success && <p className="text-green-500 text-xs italic mt-2">{t("Availabilities updated successfully!")}</p>}
        </>
      )}
    </div>
  );
};

export default AvailabilityManager;