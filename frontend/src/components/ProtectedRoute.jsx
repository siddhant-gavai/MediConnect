import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute Component
 * Wraps routes that require user authentication. If the user is not logged in,
 * it redirects them to the sign-in page while preserving their intended destination.
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
