import DatePicker from "react-multi-date-picker";
import React, { useState, useEffect} from "react";
import { AppUser } from "../../types/userProfile";
import { useAuth } from "../../contexts/AuthContext";
import { Availability } from "../../types/userProfile";
import axios from "axios";
import { Button } from "@mui/material";

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

interface EditSitterAvailabilityProps {
    userId: number | null;
}

const EditSitterAvailability: React.FC<EditSitterAvailabilityProps> = ({ userId }) => {
    const [originalAvailabilities, setOriginalAvailabilities] = useState<{ available_date: Date}[]>([]);
    const [availabilities, setAvailabilities] = useState<{ available_date: Date }[]>([]);
    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const { userInfo } = useAuth();


    useEffect(() => {
    const fetchAvailabilities = async () => {
        if (!userInfo) return;

        try {
            const response = await axios.get(`${apiURL}/appuser/${userInfo.id}/availability`);
            if (response.status === 200) {
                const data = response.data.map((item: { appuser_id: number, available_date: string }) => ({
                    appuser_id: userInfo.id,
                    available_date: new Date(item.available_date)
                }));
                setAvailabilities(data);
                setOriginalAvailabilities(data);
            }
        } catch (error) {
            console.error("Error fetching availabilities:", error);
        }
    };

    fetchAvailabilities();
    }, [userInfo]);

    const onSubmit = async (data: Date[]) => {
        try {
            const addedDates = availabilities.filter((item) => item.available_date === null);
        
            const removedAvailabilities = originalAvailabilities.filter(
                (origItem) => !availabilities.some((item) => item.available_date.toDateString() === origItem.available_date.toDateString())
            );
        
            // Create new availabilities
            if (addedDates.length > 0) {
                const availabilityData = addedDates.map((item) => ({
                    available_date: item.available_date.toISOString().split("T")[0],
                }));
        
                await axios.post(`${apiURL}/appuser/${userInfo?.id}/availability`, availabilityData);
            }
        
            // Delete removed availabilities
            for (const item of removedAvailabilities) {
                await axios.delete(`${apiURL}/availability/${item.id}`);
            }
        
            // Refresh availabilities
            setAvailabilities();
        
            // Show success message or proceed as needed
            setSuccess(true);
            setError(null);
        } catch (error) {
            console.error("Error updating availabilities:", error);
            setError("Failed to update availabilities.");
        }
    };

    const labelClass =
        "block tracking-wide text-gray-700 font-bold mb-2 mt-4 text-lg";

    return (
        <div className="mb-6">
            <label className={`${labelClass}`} htmlFor="availabilities">
                Select Your Available Dates
            </label>
            <DatePicker
                multiple
                value={availabilities}
                onChange={setAvailabilities}
                format="YYYY-MM-DD"
                minDate={new Date()}
            />
            <Button
                type="submit"
                className="shadow btn-primary focus:shadow-outline focus:outline-nonefont-bold py-2 px-4 text-sm rounded w-full mr-8 sm:w-auto sm:mr-4 md:mr-6 md:w-48 md:py-3 md:px-8 mt-6"
                onClick={onSubmit}
            >
                Save Dates
            </Button>
        </div>
    );
};

export default EditSitterAvailability;