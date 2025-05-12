import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

function ProtectedRoute({ children }) {
  const location = useLocation();
  
  const verifyAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (!token || !user) {
        return false;
      }
      
      // In a real app, you would verify the token's validity here
      // For example: jwt.verify(token, secretKey)
      return true;
      
    } catch (error) {
      console.error("Auth verification error:", error);
      return false;
    }
  };

  if (!verifyAuth()) {
    // Clear invalid auth data
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Optional: Show toast notification
    toast.error('Please login to access this page', {
      position: "top-right",
      autoClose: 3000,
    });
    
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;