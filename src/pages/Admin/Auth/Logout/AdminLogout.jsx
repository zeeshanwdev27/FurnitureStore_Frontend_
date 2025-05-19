import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAdminAuth } from "../../../../context/AdminAuthContext";

function AdminLogout() {
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        logout();
        toast.success("Logged out successfully");
        navigate("/admin");
      } catch (error) {
        console.error("Logout error:", error);
        toast.error("Failed to logout properly");
        navigate("/admin");
      }
    };

    performLogout();
  }, [navigate, logout]);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Logging out...</p>
      </div>
    </div>
  );
}

export default AdminLogout;
