// src/components/ProtectedDataComponent.tsx
import React, { useEffect, useState } from 'react';
import { getProtectedData } from '../../api/apiService';
import { ProtectedData } from '../../api/types';

const ProtectedDataComponent: React.FC = () => {
  const [data, setData] = useState<ProtectedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const protectedData = await getProtectedData();
        setData(protectedData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available.</div>;

  return (
    <div>
      <h1>Protected Data</h1>
      <p>ID: {data.id}</p>
      <p>Name: {data.name}</p>
      {/* Render other fields as needed */}
    </div>
  );
};

export default ProtectedDataComponent;