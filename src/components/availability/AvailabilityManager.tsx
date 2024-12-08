import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Calendar } from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { TailSpin } from "react-loader-spinner";
import "react-multi-date-picker/styles/colors/yellow.css";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

interface Availability {
  id: number | null;
  date: Date;
}

const labelClass = "block text-gray-700 text-lg font-bold mb-2";
const DEBOUNCE_DELAY = 2000; // Adjust as needed

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
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedRecently, setSavedRecently] = useState<boolean>(false);

  const saveTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!userInfo) return;
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

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      handleAutoSave();
    }, DEBOUNCE_DELAY);
  };

  const handleAutoSave = async () => {
    if (!userInfo) return;

    setIsSaving(true);
    setError(null);
    setSuccess(false);

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

      setSuccess(true);
      setSavedRecently(true);

      // Clear savedRecently after a short time
      setTimeout(() => setSavedRecently(false), 2000);
    } catch (error) {
      console.error("Error updating availabilities:", error);
      if (!userInfo?.is_sitter) {
        setError(t(t("dashboard_Sitter_Profile_page.save_first")));
      } else {
        setError(t("failed_to_update_availabilities"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (success || error) {
      timer = setTimeout(() => {
        setSuccess(false);
        setError(null);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [success, error]);

  // Determine which message to show:
  // Priority: error > isSaving > saved
  let message = "";
  let messageColor = "text-gray-600";

  if (error) {
    message = error;
    messageColor = "text-red-500";
  } else if (isSaving) {
    message = t(t("dashboard_Sitter_Profile_page.saving"));
    messageColor = "text-brown";
  } else if (success && savedRecently) {
    message = t(t("dashboard_Sitter_Profile_page.saved"));
    messageColor = "text-brown";
  }

  return (
    <div className="relative mb-6">
      <label className={`${labelClass} mb-6`}>
        {t("dashboard_Sitter_Profile_page.availability")}
      </label>

      <div className="relative flex flex-col items-center">
        {/* Calendar */}
        <div className="flex justify-center w-full">
          <Calendar
            multiple
            value={availabilities.map((item) => item.date)}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            minDate={new Date()}
            numberOfMonths={1}
            className="rmdp-mobile yellow"
            sort
          />

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
              <TailSpin
                height="50"
                width="50"
                color="#fabe25"
                ariaLabel="loading"
              />
            </div>
          )}
        </div>

        {/* Message Area: fixed min-height to prevent layout shift */}
        <div className="min-h-[24px] flex items-center justify-center mt-2">
          {message && (
            <span className={`text-sm ${messageColor}`}>{message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;
