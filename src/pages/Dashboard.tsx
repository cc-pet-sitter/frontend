import React from "react";
import { useAuth } from "../contexts/AuthContext";
import TokenDisplay from "../components/auth/TokenDisplay";

const Dashboard: React.FC = () => {
    const { currentUser } = useAuth();

    return (
        <div className="dashboard-container">
            <h2>Dashboard</h2>
            <p>Welcome, {currentUser?.email}! This is the placeholder for your future dashboard</p>
            {/* TO DO - Implement component for protected data
            <ProtectedData /> */}
            {/* Temporal TokenDisplay component to see if the user token is OK */}
            <TokenDisplay />
        </div>
    );
};

export default Dashboard;