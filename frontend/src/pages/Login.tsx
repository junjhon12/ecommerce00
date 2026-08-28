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
      real-time validation handling, balancing strict data tracking with highly readable UI logic.
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
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6 font-sans">
            <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Admin Login</h2>
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Admin Email" 
                        required 
                        className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    />
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        placeholder="Password" 
                        required 
                        className="border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                    />
                    <button 
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm mt-2"
                    >
                        Login
                    </button>
                </form>
                {error && <p className="mt-4 text-red-600 text-sm text-center font-medium">{error}</p>}
            </div>
        </main>
    );
}