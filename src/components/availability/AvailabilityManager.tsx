import React, { useEffect, useState, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Calendar } from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
import { TailSpin } from "react-loader-spinner";
import DatePanel from "react-multi-date-picker/plugins/date_panel"

import "react-multi-date-picker/styles/colors/yellow.css";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

interface Availability {
  id: number | null;
  dateString: string; // "YYYY-MM-DD"
}

const labelClass = "block text-gray-700 text-lg font-bold mb-2";
const DEBOUNCE_DELAY = 2000;

const AvailabilityManager: React.FC = () => {
  const { userInfo } = useAuth();
  const { t } = useTranslation();

  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [originalAvailabilities, setOriginalAvailabilities] = useState<Availability[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedRecently, setSavedRecently] = useState<boolean>(false);
  const [pendingChanges, setPendingChanges] = useState<boolean>(false);

  const saveTimeoutRef = useRef<number | null>(null);

  // Fetch initial data
  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!userInfo || !userInfo.is_sitter) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get(`${apiURL}/appuser/${userInfo.id}/availability`);
        if (response.status === 200) {
          const data = response.data.map((item: { id: number; available_date: string }) => ({
            id: item.id,
            dateString: item.available_date,
          }));
          setAvailabilities(data);
          setOriginalAvailabilities(data);
        }
      } catch (err) {
        console.error("Error fetching availabilities:", err);
        setError(t("dashboard_Sitter_Profile_page.error_fetching_availability"));
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, [userInfo, t]);

  const handleDateChange = (dates: DateObject[]) => {
    const updatedAvailabilities = dates.map((dateObj) => {
      const dayString = dateObj.format("YYYY-MM-DD");
      const existing = availabilities.find((item) => item.dateString === dayString);
      return existing || { id: null, dateString: dayString };
    });
    setAvailabilities(updatedAvailabilities);
  };

  // Check if something changed whenever availabilities update
  useEffect(() => {
    if (!userInfo) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    const originalSet = new Set(originalAvailabilities.map((item) => item.dateString));
    const currentSet = new Set(availabilities.map((item) => item.dateString));
    const somethingChanged =
      availabilities.length !== originalAvailabilities.length ||
      [...currentSet].some(date => !originalSet.has(date)) ||
      [...originalSet].some(date => !currentSet.has(date));

    if (somethingChanged) {
      setPendingChanges(true);
      saveTimeoutRef.current = window.setTimeout(() => {
        handleAutoSave();
      }, DEBOUNCE_DELAY);
    } else {
      setPendingChanges(false);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [availabilities]);

  const handleAutoSave = async () => {
    if (!userInfo) return;

    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const originalSet = new Set(originalAvailabilities.map((item) => item.dateString));
      const currentSet = new Set(availabilities.map((item) => item.dateString));

      const addedDates = availabilities.filter((item) => !originalSet.has(item.dateString));
      const removedAvailabilities = originalAvailabilities.filter((item) => !currentSet.has(item.dateString));

      if (addedDates.length > 0) {
        const availabilityData = addedDates.map((item) => ({
          available_date: item.dateString,
        }));
        await axiosInstance.post(`${apiURL}/appuser/${userInfo.id}/availability`, availabilityData);
      }

      for (const item of removedAvailabilities) {
        await axiosInstance.delete(`${apiURL}/availability/${item.id}`);
      }

      // Refresh availabilities
      const response = await axiosInstance.get(`${apiURL}/appuser/${userInfo.id}/availability`);
      if (response.status === 200) {
        const data = response.data.map((resItem: { id: number; available_date: string }) => ({
          id: resItem.id,
          dateString: resItem.available_date,
        }));
        setAvailabilities(data);
        setOriginalAvailabilities(data);
      }

      setSuccess(true);
      setSavedRecently(true);
      setPendingChanges(false);
      setTimeout(() => setSavedRecently(false), 2000);
    } catch (err) {
      console.error("Error updating availabilities:", err);
      if (!userInfo?.is_sitter) {
        setError(t("dashboard_Sitter_Profile_page.save_first"));
      } else {
        setError(t("failed_to_update_availabilities"));
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Reset success/error messages after a delay
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

  const calendarValue = availabilities.map((item) =>
    new DateObject({ date: item.dateString, format: "YYYY-MM-DD" })
  );

  let message: React.ReactNode = "";
  // We'll differentiate states by color and text/spinner combo:
  // - Error: red text
  // - Pending changes: gray text + spinner
  // - Saving: gray text + spinner
  // - Success: green text

  if (error) {
    message = <span className="text-sm text-red-600">{error}</span>;
  } else if (isSaving) {
    message = (
      <span className="flex items-center text-sm text-gray-700">
        {t("dashboard_Sitter_Profile_page.saving")}...
        <TailSpin
          height="16"
          width="16"
          color="#555"
          ariaLabel="saving"
        />
      </span>
    );
  } else if (pendingChanges) {
    message = (
      <span className="flex items-center text-sm text-gray-700">
        {t("dashboard_Sitter_Profile_page.pending")}
        <TailSpin
          height="16"
          width="16"
          color="#555"
          ariaLabel="pending-changes"
        />
      </span>
    );
  } else if (success && savedRecently) {
    message = <span className="text-sm text-green-600">{t("dashboard_Sitter_Profile_page.saved")}</span>;
  }

  return (
    <div className="relative mb-6">
      <label className={`${labelClass} mb-6`}>
        {t("dashboard_Sitter_Profile_page.availability")}
      </label>

      <div className="relative flex flex-col items-center">
        <div className="flex justify-center w-full">
          <Calendar
            multiple
            value={calendarValue}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            minDate={new Date()}
            numberOfMonths={1}
            className="yellow"
            plugins={[
              <DatePanel 
                style={{
                 
                }}
              
              />
            ]}
          />

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-10">
              <TailSpin height="50" width="50" color="#fabe25" ariaLabel="loading" />
            </div>
          )}
        </div>

        {/* Message Area: fixed min-height to prevent layout shift */}
        <div className="min-h-[24px] flex items-center justify-center mt-2">
          {message}
        </div>
      </div>
    </div>
  );
};

export default AvailabilityManager;