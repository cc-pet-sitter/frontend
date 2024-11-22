import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext"
import { getIdToken } from "firebase/auth";
import { auth } from "../firebase";


const useAuthToken = (): string | null => {
    const { currentUser } = useAuth();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchToken = async () => {
            if (currentUser) {
                const idToken = await getIdToken(currentUser, true);
                if (isMounted) setToken(idToken);
            } else {
                setToken(null);
            }
        };

        fetchToken();

        // Not very sure about the below so EYES
        const unsubscribe = auth.onIdTokenChanged(fetchToken);

        return () => {
            isMounted = false;
            if (unsubscribe) unsubscribe();
        };
    }, [currentUser]);

    console.log("This is the toke: ", token);
    return token;
};

export default useAuthToken;