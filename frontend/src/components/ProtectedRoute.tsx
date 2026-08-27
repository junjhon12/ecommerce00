import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/* 
  feat: implement protected routing logic
  A wrapper component utilizing React Router's Outlet was chosen over individual route guards 
  to optimize the DRY (Don't Repeat Yourself) principle, balancing strict access control 
  with readable route structures[cite: 12].
*/
export default function ProtectedRoute() {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}