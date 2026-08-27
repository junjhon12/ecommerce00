import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const { login } = useAuth();

    /* 
      feat: handle user login submission
      Controlled form inputs mapped to local component state were chosen to optimize 
      real-time validation handling, balancing strict data tracking with highly readable UI logic[cite: 12].
    */
    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginUser(email, password);
            login(data.token);
            navigate('/dashboard');
        } catch (err: unknown) {
            setError('Failed to authenticate. Please check your credentials.');
        }
    };

    return (
        <main>
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Admin Email" 
                    required 
                />
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Password" 
                    required 
                />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </main>
    );
}