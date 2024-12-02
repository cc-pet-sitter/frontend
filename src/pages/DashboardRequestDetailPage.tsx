import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Inquiry, AppUser } from '../types/userProfile';
import ConversationComponent from '../components/chat/Conversation'; // We'll create this later

const apiURL: string = import.meta.env.VITE_API_BASE_URL;

const DashboardRequestDetailPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  console.log("RequestId : ", requestId);
  const { currentUser } = useAuth();
  const [request, setRequest] = useState<Inquiry | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<AppUser | null>(null);
  const [sitterInfo, setSitterInfo] = useState<AppUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const idToken = await currentUser?.getIdToken();

        // Fetch request details
        const requestResponse = await fetch(`${apiURL}/inquiry/${requestId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!requestResponse.ok) {
          throw new Error('Failed to fetch request details');
        }

        const requestData: Inquiry = await requestResponse.json();
        setRequest(requestData);

        // Fetch owner info
        const ownerResponse = await fetch(`${apiURL}/appuser/${requestData.owner_appuser_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!ownerResponse.ok) {
          throw new Error('Failed to fetch owner info');
        }

        const ownerData: AppUser = await ownerResponse.json();
        setOwnerInfo(ownerData);

        // Fetch sitter info
        const sitterResponse = await fetch(`${apiURL}/appuser/${requestData.sitter_appuser_id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!sitterResponse.ok) {
          throw new Error('Failed to fetch sitter info');
        }

        const sitterData: AppUser = await sitterResponse.json();
        setSitterInfo(sitterData);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchRequestDetails();
  }, [currentUser, requestId]);

  const handleAccept = async () => {
    try {
      const idToken = await currentUser?.getIdToken();
  
      const response = await fetch(`${apiURL}/inquiry/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ inquiry_status: 'approved' }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to accept the request');
      }
  
      // Update local state
      setRequest({ ...request!, inquiry_status: 'approved' });
      setSuccessMessage('Request has been approved.');
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleReject = async () => {
    try {
      const idToken = await currentUser?.getIdToken();
  
      const response = await fetch(`${apiURL}/inquiry/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ inquiry_status: 'rejected' }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to reject the request');
      }
  
      // Update local state
      setRequest({ ...request!, inquiry_status: 'rejected' });
      setSuccessMessage('Request has been rejected.');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!request || !ownerInfo || !sitterInfo) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="font-bold text-2xl mb-4">Request Details</h2>

      {/* Request Information */}
      <div className="mb-6">
        <h3 className="font-semibold text-xl">Request Information</h3>
        <p>
          <strong>Service:</strong> {request.desired_service}
        </p>
        <p>
          <strong>Dates:</strong>{' '}
          {new Date(request.start_date).toLocaleDateString()} -{' '}
          {new Date(request.end_date).toLocaleDateString()}
        </p>
        <p>
          <strong>Status:</strong> {request.inquiry_status}
        </p>
        <p>
          <strong>Message:</strong> {request.inquiry_message}
        </p>
      </div>

      {/* Owner Information */}
      <div className="mb-6">
        <h3 className="font-semibold text-xl">Owner Information</h3>
        <p>
          <strong>Name:</strong> {ownerInfo.firstname} {ownerInfo.lastname}
        </p>
        <p>
          <strong>Email:</strong> {ownerInfo.email}
        </p>
        {/* Add more owner details as needed */}
      </div>

      {/* Sitter Information */}
      <div className="mb-6">
        <h3 className="font-semibold text-xl">Sitter Information</h3>
        <p>
          <strong>Name:</strong> {sitterInfo.firstname} {sitterInfo.lastname}
        </p>
        <p>
          <strong>Email:</strong> {sitterInfo.email}
        </p>
        {/* Add more sitter details as needed */}
      </div>

      {/* Display success or error messages */}
      {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Accept/Reject Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={handleAccept}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Accept
        </button>
        <button
          onClick={handleReject}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Reject
        </button>
      </div>

      {/* Show updated status if the inquiry has been finalized */}
      {request.inquiry_status !== 'requested' && (
        <p className="text-lg font-semibold mb-6">
          This request has been {request.inquiry_status}.
        </p>
      )}

      {/* Conversation Component */}
      <div className="mb-6">
        <h3 className="font-semibold text-xl">Conversation</h3>
        <ConversationComponent
          requestId={requestId}
          ownerId={ownerInfo.id}
          sitterId={sitterInfo.id}
        />
      </div>
    </div>
  );
};

export default DashboardRequestDetailPage;