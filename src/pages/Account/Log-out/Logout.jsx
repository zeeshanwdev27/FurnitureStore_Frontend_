import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all auth-related data
    localStorage.removeItem('user');
    // localStorage.removeItem('token');
    
    // Redirect after cleanup
    navigate('/signin');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Logging out...</p>
    </div>
  );
}