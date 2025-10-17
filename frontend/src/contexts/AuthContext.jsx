import { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        try {
          await fetchUserProfile(storedToken);
        } catch (error) {
          console.error('Failed to fetch user profile on refresh:', error);
          localStorage.removeItem('authToken');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await apiService.login(credentials);
      const authToken = response.data.token;
      
      if (authToken) {
        setToken(authToken);
        localStorage.setItem('authToken', authToken);
        
        const user = response.data?.user;
        if (user) {
          setUser(user);
        }
        
        return { success: true, user: user };
      } else {
        throw new Error('Something went wrong. No token received from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await apiService.register(userData);
      const authToken = response.data.token;
      
      if (authToken) {
        setToken(authToken);
        localStorage.setItem('authToken', authToken);
        
        const user = response.data?.user;
        if (user) {
          setUser(user);
        }
        
        return { success: true, user: user };
      } else {
        throw new Error('Something went wrong. No token received from server');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await apiService.logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('authToken');
    }
  };

  const fetchUserProfile = async (authToken = token) => {
    try {
      if (authToken) {
        const response = await apiService.getUserProfile(authToken);
        const userData = response.data?.user;
        if (userData) {
          setUser(userData);
          return userData;
        }
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        logout();
      }
      throw error;
    }
  };

  const isAuthenticated = () => {
    return !!token;
  };

  const value = {
    token,
    user,
    login,
    register,
    logout,
    fetchUserProfile,
    isAuthenticated,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};