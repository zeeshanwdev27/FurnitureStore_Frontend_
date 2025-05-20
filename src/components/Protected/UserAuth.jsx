import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

function UserAuth({children}) {
const location = useLocation();
  
  const checkAuth = () => {
    try {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      return !!token && !!user; // returns true if both exist
    } catch (error) {
      console.error("Auth check error:", error);
      return false;
    }
  };

  if (checkAuth()) {
    // User is already authenticated, redirect to home
    toast.info('You are already signed in', {
      position: "top-right",
      autoClose: 3000,
    });
    
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}

export default UserAuth
