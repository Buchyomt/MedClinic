import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('medclinic_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('medclinic_token') || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('medclinic_user', JSON.stringify(user));
      localStorage.setItem('medclinic_role', user.role);
    } else {
      localStorage.removeItem('medclinic_user');
      localStorage.removeItem('medclinic_role');
    }
  }, [user]);

  const login = async (email, password, role) => {
    let res;
    try {
      res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
    } catch {
      throw new Error('Unable to connect to the medical server. Please ensure the backend server is running.');
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Login failed. Please check your credentials.');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('medclinic_user', JSON.stringify(data.user));
    localStorage.setItem('medclinic_token', data.token);
    localStorage.setItem('medclinic_role', data.user.role);
    return data.user;
  };

  const register = async (userData) => {
    let res;
    try {
      res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
    } catch {
      throw new Error('Unable to connect to the medical server. Please ensure the backend server is running.');
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Registration failed.');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('medclinic_user', JSON.stringify(data.user));
    localStorage.setItem('medclinic_token', data.token);
    localStorage.setItem('medclinic_role', data.user.role);
    return data.user;
  };

  const googleLogin = async (credential, role = 'patient') => {
    let res;
    try {
      res = await fetch(`${API_BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential, role })
      });
    } catch {
      throw new Error('Unable to connect to medical auth server.');
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'Google authentication failed.');
    }

    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('medclinic_user', JSON.stringify(data.user));
    localStorage.setItem('medclinic_token', data.token);
    localStorage.setItem('medclinic_role', data.user.role);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('medclinic_user');
    localStorage.removeItem('medclinic_token');
    localStorage.removeItem('medclinic_role');
    localStorage.removeItem('medclinic_install_dismissed');
    sessionStorage.removeItem('medclinic_install_dismissed');
  };

  const updateProfile = (updatedData) => {
    setUser(prev => {
      const next = { ...prev, ...updatedData };
      localStorage.setItem('medclinic_user', JSON.stringify(next));
      return next;
    });
  };

  const value = {
    user,
    token,
    isLoggedIn: !!user && !!token,
    role: user ? user.role : 'guest',
    login,
    register,
    googleLogin,
    logout,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
