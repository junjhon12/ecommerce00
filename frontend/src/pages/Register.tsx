import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api';

export default function Register() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();

    /* 
      feat: handle new user registration submission
      Controlled form inputs mapped to local component state were chosen to optimize 
      real-time validation handling before network execution, balancing strict data 
      tracking with highly readable UI logic.
    */
    const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        try {
            await registerUser(email, password);
            navigate('/login');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred during registration.');
            }
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 font-sans text-center">
            <div className="bg-white p-10 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create an Account</h2>
                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="Email Address" 
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
                        Register
                    </button>
                </form>
                {error && <p className="mt-4 text-red-600 text-sm font-medium">{error}</p>}
                <p className="mt-6 text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Log in</Link>
                </p>
            </div>
        </main>
    );
}