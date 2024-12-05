// src/components/availability/AvailabilityManager.tsx

import React, { useEffect, useState, useCallback, useMemo } from "react";
import axiosInstance from "../../api/axiosInstance";
import { Calendar } from "react-multi-date-picker";
import { DateObject } from "react-multi-date-picker";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";
// import { MdUpdate } from "react-icons/md";
import "react-multi-date-picker/styles/colors/yellow.css";
import { debounce } from "lodash";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

interface Availability {
  id: number | null;
  date: DateObject;
}

const AvailabilityManager: React.FC = () => {
  const { userInfo } = useAuth();
  const { t } = useTranslation();

  // State variables
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [originalAvailabilities, setOriginalAvailabilities] = useState<Availability[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Fetch the user's current availabilities from the backend.
   */
  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!userInfo) return;
      if (!userInfo.is_sitter) return;

      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(
          `${apiURL}/appuser/${userInfo.id}/availability`
        );

        if (response.status === 200) {
          const data: Availability[] = response.data.map(
            (item: { id: number; available_date: string }) => ({
              id: item.id,
              date: new DateObject(item.available_date),
            })
          );
          setAvailabilities(data);
          setOriginalAvailabilities(data);
        } else {
          throw new Error("Unexpected response status");
        }
      } catch (err: any) {
        console.error("Error fetching availabilities:", err);
        setError(t("failed_to_fetch_availabilities"));
      } finally {
        setLoading(false);
      }
    };

    fetchAvailabilities();
  }, [userInfo, t]);

  /**
   * Handle changes in the selected dates.
   * Updates the state and triggers autosave with debouncing.
   */
  const handleDateChange = (dates: DateObject[]) => {
    const updatedAvailabilities: Availability[] = dates.map((dateObj) => {
      const dateStr = dateObj.format("YYYY-MM-DD");
      const existing = availabilities.find(
        (item) => item.date.format("YYYY-MM-DD") === dateStr
      );
      return existing || { id: null, date: dateObj };
    });

    setAvailabilities(updatedAvailabilities);
    debouncedSave(updatedAvailabilities);
  };

  /**
   * Debounced function to save availabilities.
   * Prevents excessive API calls by waiting for user to stop making changes.
   */
  const debouncedSave = useMemo(
    () =>
      debounce(async (updatedAvailabilities: Availability[]) => {
        await handleSave(updatedAvailabilities);
      }, 2000), // 1000ms debounce delay
    [userInfo, originalAvailabilities, t]
  );

  /**
   * Save the updated availabilities to the backend.
   * Handles both additions and deletions.
   */
  const handleSave = useCallback(
    async (updatedAvailabilities: Availability[]) => {
      if (!userInfo) return;

      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        // Identify newly added dates (id === null)
        const addedDates = updatedAvailabilities.filter((item) => item.id === null);

        // Identify removed dates by comparing with original availabilities
        const removedAvailabilities = originalAvailabilities.filter(
          (origItem) =>
            !updatedAvailabilities.some(
              (item) => item.date.format("YYYY-MM-DD") === origItem.date.format("YYYY-MM-DD")
            )
        );

        // Handle additions
        let newlyCreatedAvailabilities: Availability[] = [];
        if (addedDates.length > 0) {
          const availabilityData = addedDates.map((item) => ({
            available_date: item.date.format("YYYY-MM-DD"),
          }));

          const postResponse = await axiosInstance.post(
            `${apiURL}/appuser/${userInfo.id}/availability`,
            availabilityData
          );

          if (postResponse.status === 201 || postResponse.status === 200) {
            const createdData: Availability[] = postResponse.data.map(
              (item: { id: number; available_date: string }) => ({
                id: item.id,
                date: new DateObject(item.available_date),
              })
            );
            newlyCreatedAvailabilities = createdData;
          } else {
            throw new Error("Failed to create new availabilities.");
          }
        }

        // Handle deletions
        for (const item of removedAvailabilities) {
          if (item.id !== null) { // Ensure the item has an ID before attempting to delete
            await axiosInstance.delete(`${apiURL}/availability/${item.id}`);
          }
        }

        // Update state optimistically
        setOriginalAvailabilities((prevOriginal) => [
          // Remove deleted items
          ...prevOriginal.filter(
            (origItem) =>
              !removedAvailabilities.some(
                (item) => item.id === origItem.id
              )
          ),
          // Add newly created items
          ...newlyCreatedAvailabilities,
        ]);

        setAvailabilities((prevAvail) => [
          // Remove deleted items
          ...prevAvail.filter(
            (item) =>
              !removedAvailabilities.some(
                (origItem) => origItem.id === item.id
              )
          ),
          // Add newly created items
          ...newlyCreatedAvailabilities,
        ]);

        // Show success message
        setSuccess(true);
      } catch (err: any) {
        console.error("Error updating availabilities:", err);
        if (err.response && err.response.status === 403) {
          setError(t("You need to save your profile first before updating availabilities"));
        } else {
          setError(t("failed_to_update_availabilities"));
        }
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    },
    [userInfo, originalAvailabilities, t]
  );

  /**
   * Cleanup debounced function on unmount to prevent memory leaks.
   */
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return (
    <div className="mb-6 -z-50">
      <label className="block tracking-wide text-gray-700 font-bold mb-2 mt-4 text-lg">
        {t("dashboard_Sitter_Profile_page.availability")}
      </label>
      {loading ? (
        <p>{t("Loading")}...</p>
      ) : (
        <>
          {/* Enlarged and Responsive Calendar */}
          <div className="flex justify-center">
            <Calendar
              multiple
              value={availabilities.map((item) => item.date)}
              onChange={handleDateChange}
              format="YYYY-MM-DD"
              minDate={new Date()}
              numberOfMonths={1} // Adjust as needed
              className="rmdp-mobile yellow"
              sort
            />
          </div>

          {/* Success and Error Messages */}
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