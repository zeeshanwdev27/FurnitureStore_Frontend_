import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Create context
const AdminAuthContext = createContext();

// Custom hook to use the context
export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing valid token on initial load
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Verify token with backend
        const response = await axios.get('http://localhost:3000/api/admin/verify-token', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.isValid) {
          setAdmin({ token });
        } else {
          clearToken();
        }
      } catch (err) {
        console.error("Token verification failed:", err);
        clearToken();
      } finally {
        setLoading(false);
      }
    };

    verifyToken();

    // Set up axios response interceptor
    const interceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          handleLogout();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptor on unmount
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const clearToken = () => {
    localStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminToken');
    setAdmin(null);
  };

  const handleLogout = () => {
    clearToken();
    navigate('/admin');
  };

  // Login function
const login = async (token, rememberMe) => {  
  try {
    if (rememberMe) {
      localStorage.setItem('adminToken', token);
    } else {
      sessionStorage.setItem('adminToken', token);
    }
    setAdmin({ token });
    return true;
  } catch (err) {
    console.error("Login failed:", err);
    return false;
  }
};

  // Logout function
  const logout = () => {
    handleLogout();
  };

  // Get auth token
  const getAuthToken = () => {
    if (!admin?.token) {
      throw new Error('No authentication token found');
    }
    return admin.token;
  };

  return (
    <AdminAuthContext.Provider 
      value={{ 
        admin,
        login,
        logout,
        getAuthToken,
        isAuthenticated: !!admin?.token,
        isLoading: loading
      }}
    >
      {!loading && children}
    </AdminAuthContext.Provider>
  );
};