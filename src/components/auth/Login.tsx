import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const { setUserInfo } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            // Sign in with Firebase
            const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Get Firebase ID token
            const idToken = await user.getIdToken();

            // Send token to backend to retrieve user info
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
                throw new Error(data.detail || "Failed to log in.");
            }

            const data = await response.json();

            // Update AuthContext with userInfo
            setUserInfo(data);

            // Navigate to dashboard or home
            navigate('/dashboard');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        }
    }

    return (
        <div className="auth-container">
            <h2>Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;