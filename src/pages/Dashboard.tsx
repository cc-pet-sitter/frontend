import React from "react";
import { useAuth, useState } from "../contexts/AuthContext";
import TokenDisplay from "../components/auth/TokenDisplay";
import EditSitterProfileForm from "../components/profile/EditSitterProfileForm";
import SignUpForm from "../components/profile/SignUpForm";

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  const [showEditProfileForm, setShowEditProfileForm] =
    useState<boolean>(false);

  const [showSignUpForm, setShowSignUpForm] = useState<boolean>(false);

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <p>
        Welcome, {currentUser?.email}! This is the placeholder for your future
        dashboard
      </p>
      {/* TO DO - Implement component for protected data
            <ProtectedData /> */}
      {/* Temporal TokenDisplay component to see if the user token is OK */}
      <TokenDisplay />

      <button
        onClick={() => setShowEditProfileForm((prev: boolean) => !prev)}
        className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
      >
        {showEditProfileForm ? "Close" : "Edit Sitter Details"}
      </button>

      {showEditProfileForm && (
        <div className="mt-6">
          <EditSitterProfileForm />
        </div>
      )}
      <button
        onClick={() => setShowSignUpForm((prev: boolean) => !prev)}
        className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
      >
        {showSignUpForm ? "Close" : "Sign Up"}
      </button>

      {showSignUpForm && (
        <div className="mt-6">
          <SignUpForm />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
