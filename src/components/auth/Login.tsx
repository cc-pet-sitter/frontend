import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import React, { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "react-i18next";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false); // For password visibility
  const navigate = useNavigate();
  const { setUserInfo, currentUser } = useAuth(); // Access currentUser from AuthContext

  const { t } = useTranslation();

  useEffect(() => {
    if (currentUser) {
      navigate("/"); // Redirect authenticated users away from login page
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      // Sign in with Firebase
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get Firebase ID token
      const idToken = await user.getIdToken();

      // Send token to backend to retrieve user info
      const backendURL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const response = await fetch(`${backendURL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        // No body needed since backend uses token
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Failed to log in.");
      }

      const data = await response.json();

      // Update AuthContext with userInfo
      setUserInfo(data);

      // Navigate to dashboard or home
      navigate("/");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    }
  };

  const inputClass =
    "appearance-none block w-full bg-gray-200 text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white";
  const labelClass =
    "block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2";

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">{t("login.title")}</h2>
        {error && (
          <p
            className="text-red-500 text-sm italic mb-4 text-center"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="w-full">
          {/* Email Field */}
          <div className="mb-4">
            <label className={labelClass} htmlFor="email">
              {t("login.email")}:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={inputClass}
              placeholder="you@example.com"
              aria-required="true"
            />
          </div>
          {/* Password Field */}
          <div className="mb-6">
            <label className={labelClass} htmlFor="password">
              {t("login.password")}:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`${inputClass} pr-10`}
                placeholder="••••••••"
                aria-required="true"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  // Eye icon for hiding password
                  <svg
                    className="h-5 w-5 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a7 7 0 015.916 3.784A7.003 7.003 0 0110 17a7.003 7.003 0 01-5.916-3.784A7 7 0 0110 3zm0 12a5 5 0 104.899-3.243l1.614 1.615a.5.5 0 11-.707.708l-1.614-1.615A5 5 0 0010 15zm0-8a3 3 0 110 6 3 3 0 010-6z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  // Eye-off icon for showing password
                  <svg
                    className="h-5 w-5 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 3c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 100-10 5 5 0 000 10z" />
                    <path d="M10 6a4 4 0 013.995 3.8L14 10a4 4 0 11-3.8 3.995L10 14a4 4 0 01-3.995-3.8L6 10a4 4 0 013.8-3.995L10 6z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {/* Submit Button */}
          <div className="mb-6">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
            >
              {t("login.loginButton")}
            </button>
          </div>
        </form>
        {/* Explanatory Text and Sign Up Navigation */}
        <div className="text-center">
          <p className="text-gray-600 mb-2">
            {t("login.signupPrompt")}
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
          >
            {t("login.signupButton")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;