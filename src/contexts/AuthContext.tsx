import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

// Define the shape of the context
interface AuthContextType {
  currentUser: User | null;
  isOwner: boolean;
  isSitter: boolean;
  setIsOwner: (value: boolean) => void;
  setIsSitter: (value: boolean) => void;
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
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [isSitter, setIsSitter] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch user roles from backend or Firebase custom claims
        // For now, use localStorage to mock roles
        const ownerRole = localStorage.getItem("isOwner") === "true";
        const sitterRole = localStorage.getItem("isSitter") === "true";
        setIsOwner(ownerRole);
        setIsSitter(sitterRole);
      } else {
        setIsOwner(false);
        setIsSitter(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    isOwner,
    isSitter,
    setIsOwner,
    setIsSitter,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};