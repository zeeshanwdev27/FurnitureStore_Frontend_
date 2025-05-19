
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminProtectedRoute = () => {
  const { isAuthenticated } = useAdminAuth();

  // If admin is not authenticated, redirect to admin login
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin" />;
};

export default AdminProtectedRoute;