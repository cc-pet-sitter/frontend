import axiosInstance from './axiosInstance';
import { ProtectedData, ApiError } from './types';
import { ENDPOINTS } from './endpoints';
import axios from 'axios';

// Fetch protected data from the backend.
export const getProtectedData = async (): Promise<ProtectedData> => {
  try {
    const response = await axiosInstance.get<ProtectedData>(ENDPOINTS.GET_PROTECTED_DATA);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Handle API errors by throwing a standardized error.
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with a status other than 2xx
      const apiError: ApiError = error.response.data;
      throw new Error(apiError.message || 'An error occurred while fetching data.');
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response received from the server.');
    } else {
      // Something else happened while setting up the request
      throw new Error(error.message);
    }
  } else {
    // Non-Axios error
    throw new Error('An unexpected error occurred.');
  }
};