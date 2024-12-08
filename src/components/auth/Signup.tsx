import React, { FormEvent, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "../../firebase";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../contexts/AuthContext";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { setUserInfo } = useAuth();

  const { t } = useTranslation();

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectTo = params.get("redirect");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      // Create user in Firebase
      const userCredential: UserCredential =
        await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtain ID token
      const idToken = await user.getIdToken();

      // Send user data to backend
      const backendURL =
        import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const response = await fetch(`${backendURL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ firstname, lastname, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to create user in backend.");
      }

      setUserInfo(data.appuser);

      if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate("/dashboard/account"); // fallback if no redirect is provided
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message);
    }
  };

  const inputClass =
    "appearance-none block w-full bg-white text-gray-700 border rounded py-3 px-4 leading-tight focus:outline-none focus:ring-1 focus:ring-[#D87607] focus:border-[#D87607]";
  const labelClass = "block tracking-wide text-sm mb-2";

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-md bg-white rounded-lg border border-gray p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {t("signup.title")}
        </h2>
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
          <div className="flex flex-wrap -mx-3">
            {/* First Name */}
            <div className="w-full px-3 mb-6">
              <label className={labelClass} htmlFor="firstname">
                {t("signup.firstname")}
              </label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                required
                className={inputClass}
                placeholder={t("signup.firstnamePlaceholder")}
                aria-required="true"
              />
            </div>
            {/* Last Name */}
            <div className="w-full px-3 mb-6">
              <label className={labelClass} htmlFor="lastname">
                {t("signup.lastname")}
              </label>
              <input
                type="text"
                id="lastname"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                required
                className={inputClass}
                placeholder={t("signup.lastnamePlaceholder")}
                aria-required="true"
              />
            </div>
            {/* Email */}
            <div className="w-full px-3 mb-6">
              <label className={labelClass} htmlFor="email">
                {t("signup.email")}
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
            {/* Password */}
            <div className="w-full px-3 mb-6">
              <label className={labelClass} htmlFor="password">
                {t("signup.password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} // Toggle password visibility
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`${inputClass} pr-10`} // Add padding for the toggle button
                  placeholder={t("signup.passwordPlaceholder")}
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
            <div className="w-full px-3 mb-6">
              <button
                type="submit"
                className="w-full btn-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-200"
              >
                {t("signup.signupButton")}
              </button>
            </div>
          </div>
        </form>
        {/* Explanatory Text and Login Navigation */}
        <div className="text-center ">
          <p className="text-gray-500 mb-2 text-sm">
            {t("signup.signupPrompt")}{" "}
            <a
              onClick={() => navigate("/login")}
              className="text-black underline cursor-pointer"
            >
              {t("signup.loginButton")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
