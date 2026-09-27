import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { authService } from '../services/authService';
import { INITIAL_USERS } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, pass: string, role: UserRole) => Promise<void>;
  loginAsDemo: (role: UserRole) => Promise<void>;
  switchRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Principal demo for immediate review, or restore from localStorage
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('edunexus_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USERS[0];
      }
    }
    return INITIAL_USERS[0]; // Dr. Ramesh Sundaram (Principal)
  });

  const role: UserRole = user?.role || 'principal';

  useEffect(() => {
    if (user) {
      localStorage.setItem('edunexus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('edunexus_user');
    }
  }, [user]);

  const login = async (email: string, pass: string, selectedRole: UserRole) => {
    const loggedUser = await authService.login(email, pass, selectedRole);
    setUser(loggedUser);
  };

  const loginAsDemo = async (demoRole: UserRole) => {
    const demoUser = await authService.getDemoUser(demoRole);
    setUser(demoUser);
  };

  const switchRole = (newRole: UserRole) => {
    const match = INITIAL_USERS.find((u) => u.role === newRole);
    if (match) {
      setUser(match);
    } else {
      setUser({
        id: `usr_${newRole}`,
        name: newRole === 'principal' ? 'Dr. Ramesh Sundaram' : newRole === 'teacher' ? 'Prof. Anitha Vasudevan' : 'Suresh Kumar',
        email: `${newRole}@edunexus.edu`,
        role: newRole,
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        login,
        loginAsDemo,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
