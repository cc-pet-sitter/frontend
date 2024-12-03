import axios from "axios";
import { getAuth } from "firebase/auth"; // Import Firebase authentication

// Define the base URL for FastAPI backend
const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Add request interceptor
axiosInstance.interceptors.request.use(async (config) => {
  const auth = getAuth(); // Get the Firebase Auth instance
  const user = auth.currentUser;

  if (user) {
    const token = await user.getIdToken(); // Retrieve the Firebase token
    config.headers.Authorization = `Bearer ${token}`; // Set the Authorization header
  }

  return config;
});

export default axiosInstance;

// // Create an Axios instance with default settings
// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   // other default configurations here
// });

// // Request interceptor to add Authorization header
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // Adjust token retrieval as needed
//     if (token && config.headers) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor to handle responses globally
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle specific error statuses here
//     if (error.response) {
//       // Server responded with a status other than 2xx
//       console.error("API Error:", error.response.data);
//     } else if (error.request) {
//       // No response received
//       console.error("Network Error:", error.request);
//     } else {
//       // Something else happened
//       console.error("Error:", error.message);
//     }
//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;
