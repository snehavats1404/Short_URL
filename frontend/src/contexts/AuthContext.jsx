// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/axios';  // Ensure 'api' is imported correctly

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Add an endpoint in your backend to verify tokens
          const response = await api.get('/user/verify-token', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.data?.user) {
            setUser(response.data.user);  // Assuming the user data is returned in response.data.user
          } else {
            // If no valid user returned, remove token and reset user
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);  // No token found, reset user state
      }
      setLoading(false);  // Stop loading once the verification completes
    };

    validateToken();
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setUser({ token });  // Optionally, store user data as well if available
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
