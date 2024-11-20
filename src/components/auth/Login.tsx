import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";
import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";


const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const UserCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
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