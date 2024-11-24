import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, UserCredential } from "firebase/auth";
import { auth } from "../../firebase";

const SignUp: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            // Create user in Firebase
            const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Obtain ID token
            const idToken = await user.getIdToken();

            // Send user data to backend
            const backendURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
            const response = await fetch(backendURL + "/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${idToken}`,
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || "Failed to create user in backend.");
            }

            // Navigate to dashboard or home
            navigate('/dashboard');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message);
        }
    }

    return (
        <div className="auth-container">
            <h2>Sign Up</h2>
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
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUp;