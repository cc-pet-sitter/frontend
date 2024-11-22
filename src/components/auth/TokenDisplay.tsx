// This is a temporal component to check if we are managing the User tokens properly

import React, { useEffect, useState } from 'react';
import { getIdToken } from 'firebase/auth';
import { auth } from '../../firebase';
import { User } from 'firebase/auth';

const TokenDisplay: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchToken = async () => {
      const user: User | null = auth.currentUser;
      if (user) {
        try {
          const idToken = await getIdToken(user, true); // forceRefresh: true
          setToken(idToken);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          setError(err.message);
        }
      } else {
        setError('No user is currently logged in.');
      }
    };
    fetchToken();
  }, []);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="token-display">
      <h3>ID Token:</h3>
      <textarea readOnly value={token} rows={10} cols={50} />
    </div>
  );
};

export default TokenDisplay;