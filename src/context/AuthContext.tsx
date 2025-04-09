
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock authentication for demo
  useEffect(() => {
    // Check if we have a user in localStorage
    const storedUser = localStorage.getItem('tennis_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Login function - in a real app, this would validate with a backend
  const login = async (email: string, password: string) => {
    // For demo purposes, we'll just check hardcoded values
    if (email === 'admin@example.com' && password === 'password') {
      const adminUser: User = {
        id: '1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem('tennis_user', JSON.stringify(adminUser));
      return;
    }
    
    if (email === 'coach@example.com' && password === 'password') {
      const coachUser: User = {
        id: '2',
        name: 'Coach User',
        email: 'coach@example.com',
        role: 'coach',
        schoolId: '1', // Westside High School
      };
      setUser(coachUser);
      localStorage.setItem('tennis_user', JSON.stringify(coachUser));
      return;
    }
    
    throw new Error('Invalid credentials');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tennis_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
