import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Component to protect routes that require authentication
 */
export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    // Save the page user was trying to visit
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}
