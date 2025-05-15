"use client";
import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

// Create the auth context
const AuthContext = createContext();

// Base URL for API calls
const BASE_URL = "http://localhost:5010/api";

export const AuthProvider = ({ children }) => {
  // State for user, loading, and error
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if token exists in localStorage on component mount
  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.getItem("token")) {
        try {
          setAuthToken(localStorage.getItem("token"));
          // Get user data if token exists (you might need to create a route for this)
          const userId = getUserIdFromToken(localStorage.getItem("token"));
          if (userId) {
            const response = await axios.get(`${BASE_URL}/users/${userId}`);
            setUser(response.data);
          }
        } catch (err) {
          localStorage.removeItem("token");
          setError("Authentication failed. Please login again.");
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BASE_URL}/users/register`, userData);

      const { token, user } = response.data;

      // Save token to local storage
      localStorage.setItem("token", token);

      // Set auth token in headers
      setAuthToken(token);

      // Set user in state
      setUser(user);

      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false);
      return false;
    }
  };

  // Login a user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${BASE_URL}/users/login`, credentials);

      const { token, user } = response.data;

      // Save token to local storage
      localStorage.setItem("token", token);

      // Set auth token in headers
      setAuthToken(token);

      // Set user in state
      setUser(user);

      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
      setLoading(false);
      return false;
    }
  };

  // Logout a user
  const logout = () => {
    // Remove token from local storage
    localStorage.removeItem("token");

    // Remove auth token from headers
    setAuthToken(null);

    // Reset user in state
    setUser(null);

    setError(null);
  };

  // Update user profile
  const updateUserProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put(
        `${BASE_URL}/users/${user._id}`,
        userData
      );
      setUser(response.data);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
      setLoading(false);
      return false;
    }
  };

  // Delete user account
  const deleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      await axios.delete(`${BASE_URL}/users/${user._id}`);
      logout();
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
      setLoading(false);
      return false;
    }
  };

  // Get all users (admin function)
  const getAllUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BASE_URL}/users`);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to get users");
      setLoading(false);
      return [];
    }
  };

  // Helper function to set auth token in headers
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  // Helper function to extract user ID from JWT token
  const getUserIdFromToken = (token) => {
    try {
      // This is a simple way to decode a JWT token without using libraries
      // In production, use a proper JWT library
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      return JSON.parse(jsonPayload).id;
    } catch (error) {
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateUserProfile,
        deleteAccount,
        getAllUsers,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
