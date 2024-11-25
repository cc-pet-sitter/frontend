import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import TokenDisplay from "../components/auth/TokenDisplay";
import EditSitterProfileForm from "../components/profile/EditSitterProfileForm";
import SignUpForm from "../components/profile/SignUpForm";

const DashboardAccountPage: React.FC = () => {
  const { currentUser } = useAuth();

  const [showSignUpForm, setShowSignUpForm] = useState<boolean>(false);

  return (
    <div className="dashboard-container">
      <h2>Account Info</h2>
      {/* TO DO - Implement component for protected data
              <ProtectedData /> */}
      {/* Temporal TokenDisplay component to see if the user token is OK */}
      {/* <TokenDisplay /> */}

      {/* Will show Account info : <SignUpForm> */}
      <button
        onClick={() => setShowSignUpForm((prev: boolean) => !prev)}
        className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
      >
        {showSignUpForm ? "Save" : "Edit Account Info"}
      </button>

      {showSignUpForm && (
        <div className="mt-6">
          <SignUpForm />
        </div>
      )}
    </div>
  );
};

export default DashboardAccountPage;
