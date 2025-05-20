import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext.jsx';
import { toast } from 'react-toastify';

const AdminAuth = ({ children }) => {
  const { isAuthenticated, isVerifying } = useAdminAuth();
  const location = useLocation();

  if (isVerifying) {
    return (
      <div className="p-8 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    toast.info('You are already logged in as admin.', {
      position: "top-right",
      autoClose: 3000,
    });
    return <Navigate to="/admin/dashboard" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminAuth;