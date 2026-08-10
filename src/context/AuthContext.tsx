import React, { createContext, useContext, useState } from 'react';
import { User, RolePermission } from '../types';
import { initialRolePermissions } from '../data/initialData';
import { loginWithSheet } from '../services/googleSheetsApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  rolePermissions: RolePermission | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (loginId: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  hasPermission: (permissionKey: keyof RolePermission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tanker_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tanker_token'));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const rolePermissions = user ? initialRolePermissions.find((p) => p.role === user.role) || null : null;

  const login = async (loginId: string, password?: string) => {
    setIsLoading(true);
    const result = await loginWithSheet(loginId, password || '');
    setIsLoading(false);

    if (result.success && result.user) {
      const sessionToken = `sheet_session_${Date.now()}`;
      setUser(result.user);
      setToken(sessionToken);
      localStorage.setItem('tanker_user', JSON.stringify(result.user));
      localStorage.setItem('tanker_token', sessionToken);
      return { success: true };
    }

    return { success: false, error: result.error || 'Invalid credentials or user not registered in Sheet Master.' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tanker_user');
    localStorage.removeItem('tanker_token');
  };

  const hasPermission = (permissionKey: keyof RolePermission): boolean => {
    if (!rolePermissions) return false;
    return Boolean(rolePermissions[permissionKey]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        rolePermissions,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
