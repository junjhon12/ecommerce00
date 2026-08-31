import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();
    const { cart, cartTotal } = useCart();
    const navigate = useNavigate();

    /* 
      feat: handle user logout
      Using a programmatic navigation redirect after clearing the local storage token
      was chosen to optimize the UX, balancing secure session termination with 
      highly readable component lifecycle logic.
    */
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold text-indigo-600 tracking-tight">
                    ShopSmart
                </Link>
                
                <div className="flex items-center gap-6">
                    <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                        Catalog
                    </Link>
                    
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200 hidden sm:flex">
                        <span className="text-sm font-semibold text-gray-800">Cart ({cartItemCount})</span>
                        <span className="text-sm font-bold text-green-600">${cartTotal.toFixed(2)}</span>
                    </div>

                    {isAuthenticated ? (
                        <>
                            <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                                Dashboard
                            </Link>
                            <button 
                                onClick={handleLogout}
                                className="text-red-600 hover:text-red-700 font-medium transition-colors"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-gray-700 hover:text-indigo-600 font-medium transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}