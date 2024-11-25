import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";


interface UserInfo {
  status: string;
  user_id: number;
  email: string;
  firstname: string | null;
  lastname: string | null;
  is_sitter: string | null;
  profile_picture_src: string | null;
  // Add other fields as necessary
}

// Define the shape of the context
interface AuthContextType {
  currentUser: User | null;
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for accessing the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Props type for AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const backendURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
          const response = await fetch(`${backendURL}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${idToken}`,
            },
            // No body needed since backend uses token
          });

          if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || "Failed to fetch user info.");
          }

          const data: UserInfo = await response.json();
          setUserInfo(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          console.error("Failed to fetch user info:", err.message);
          setUserInfo(null);
        }
      } else {
        setUserInfo(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userInfo,
    setUserInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};