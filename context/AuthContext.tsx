
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { AuthContextType, User } from '../types';
import { loginUser, signupUser, validateSession } from '../services/authService';
import { clearSession, getSession, setSession } from '../utils/storage';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAuthSuccess = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    setSession({ user: userData, token: userToken });
  };
  
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    clearSession();
  }, []);

  useEffect(() => {
    const checkUserSession = async () => {
      const session = getSession();
      if (session?.token) {
        try {
          const userData = await validateSession(session.token);
          if (userData) {
            setUser(userData);
            setToken(session.token);
          } else {
            logout();
          }
        } catch (error) {
          logout();
        }
      }
      setLoading(false);
    };

    checkUserSession();
  }, [logout]);


  const login = async (email: string, password: string) => {
    const { user: userData, token: userToken } = await loginUser(email, password);
    handleAuthSuccess(userData, userToken);
  };

  const signup = async (email: string, password: string) => {
    const { user: userData, token: userToken } = await signupUser(email, password);
    handleAuthSuccess(userData, userToken);
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
