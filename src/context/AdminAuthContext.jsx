import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null); // User data
  const [token, setToken] = useState(localStorage.getItem("adminToken")); // JWT token
  const [loading, setLoading] = useState(true); // Loading flag
  const navigate = useNavigate();

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get("http://localhost:3000/api/admin/verify-token", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const storedAdmin = localStorage.getItem("admin");
          if (storedAdmin) {
            setAdmin(JSON.parse(storedAdmin));
          }
        } catch (error) {
          console.error("Token verification failed:", error);
          logout(); // Clear invalid/expired token
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  // Login function
  const login = (userData, token, rememberMe) => {
    setAdmin(userData);
    setToken(token);
    localStorage.setItem("admin", JSON.stringify(userData));
    localStorage.setItem("adminToken", token);
    if (!rememberMe) {
      // Clear token on browser close if rememberMe is false
      window.addEventListener("beforeunload", () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("admin");
      });
    }
  };

  // Logout function
  const logout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("admin");
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  // Add token to axios headers for all requests
  axios.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Handle 401 errors globally
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        logout();
        navigate("/admin");
      }
      return Promise.reject(error);
    }
  );

  return (
    <AdminAuthContext.Provider
      value={{ admin, token, login, logout, isAuthenticated: !!admin && !!token, loading }}
    >
      {!loading && children}
    </AdminAuthContext.Provider>
  );
};