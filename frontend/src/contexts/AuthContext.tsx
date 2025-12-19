// src/contexts/AuthContext.tsx
import React, { createContext, useState, useContext, useEffect} from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  loginUserContext: (userData: User) => void;
  logoutUserContext: () => void;
  setUserContext: (user: User | null) => void; // For manual updates if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Start true to check local storage

  useEffect(() => {
    const storedUser = localStorage.getItem('notesAppUser');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('notesAppUser');
      }
    }
    setIsLoading(false);
  }, []);

  const loginUserContext = (userData: User) => {
    localStorage.setItem('notesAppUser', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logoutUserContext = () => {
    localStorage.removeItem('notesAppUser');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  const setUserContext = (updatedUser: User | null) => {
    if (updatedUser) {
      localStorage.setItem('notesAppUser', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsAuthenticated(true);
    } else {
      logoutUserContext();
    }
  };


  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, loginUserContext, logoutUserContext, setUserContext }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};