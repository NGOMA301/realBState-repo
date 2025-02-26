import { useState, useEffect, useCallback } from "react";

const API_URL = "http://localhost:5000";

export function useAuth() {
  const [authState, setAuthState] = useState({
    user: null,
    loading: true,
    error: null
  });

  const updateUser = useCallback((newUserData) => {
    setAuthState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        ...newUserData
      }
    }));
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/profile`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch user profile");

      const data = await response.json();
      setAuthState({
        user: data.user,
        loading: false,
        error: null
      });
      
    } catch (error) {
      console.error("Error fetching user:", error);
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Logout failed");
      
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
      window.location.href = '/';

    } catch (error) {
      console.error("Error logging out:", error);
      setAuthState(prev => ({
        ...prev,
        error: error.message
      }));
    }
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      await fetchUser();
    };
    
    if (authState.loading) {
      initializeAuth();
    }
  }, [authState.loading, fetchUser]);

  return { 
    ...authState,
    fetchUser,
    updateUser,
    logout
  };
}