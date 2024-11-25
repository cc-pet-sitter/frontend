// src/pages/Dashboard.tsx
import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import EditSitterProfileForm from "../components/profile/EditSitterProfileForm";
import EditOwnerProfileForm from "../components/profile/EditOwnerProfileForm";

const Dashboard: React.FC = () => {
  const { currentUser, isOwner, isSitter } = useAuth();

  const [showEditSitterProfile, setShowEditSitterProfile] =
    useState<boolean>(false);
  const [showEditOwnerProfile, setShowEditOwnerProfile] =
    useState<boolean>(false);

  return (
    <div className="dashboard-container p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <p className="mb-6">Welcome, {currentUser?.email}!</p>
      <p>Manage your profiles below.</p>

      {/* Sitter Profile Section */}
      {isSitter && (
        <div className="mb-6">
          <button
            onClick={() => setShowEditSitterProfile((prev) => !prev)}
            className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          >
            {showEditSitterProfile
              ? "Close Sitter Profile"
              : "Edit Sitter Profile"}
          </button>

          {showEditSitterProfile && (
            <div className="mt-4">
              <EditSitterProfileForm />
            </div>
          )}
        </div>
      )}

      {/* Owner Profile Section */}
      {isOwner && (
        <div className="mb-6">
          <button
            onClick={() => setShowEditOwnerProfile((prev) => !prev)}
            className="shadow bg-gray-500 hover:bg-gray-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
          >
            {showEditOwnerProfile
              ? "Close Owner Profile"
              : "Edit Owner Profile"}
          </button>

          {showEditOwnerProfile && (
            <div className="mt-4">
              <EditOwnerProfileForm />
            </div>
          )}
        </div>
      )}

      {/* Option to Add a Role */}
      {!isOwner && !isSitter && (
        <div className="mb-6">
          <p>You currently have no roles assigned.</p>
          <button
            onClick={() => {
              /* Implement role assignment logic */
            }}
            className="shadow bg-blue-500 hover:bg-blue-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded"
          >
            Assign Roles
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
