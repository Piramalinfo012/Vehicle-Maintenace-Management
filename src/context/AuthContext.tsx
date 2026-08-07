import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, RolePermission } from '../types';
import { initialUsers, initialRolePermissions } from '../data/initialData';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  rolePermissions: RolePermission | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRoleDemo: (role: UserRole) => void;
  hasPermission: (permissionKey: keyof RolePermission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tanker_user');
    return saved ? JSON.parse(saved) : initialUsers[0]; // default to Admin for rich preview
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tanker_token') || 'demo_jwt_token_2026');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const rolePermissions = user ? initialRolePermissions.find((p) => p.role === user.role) || null : null;

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const data = await api.login({ email, password });
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('tanker_user', JSON.stringify(data.user));
      localStorage.setItem('tanker_token', data.token);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      // Fallback demo match if server fails or offline
      const found = initialUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
        setToken('demo_jwt_token_2026');
        localStorage.setItem('tanker_user', JSON.stringify(found));
        localStorage.setItem('tanker_token', 'demo_jwt_token_2026');
        return { success: true };
      }
      return {
        success: false,
        error: err.response?.data?.error || 'Invalid credentials or user not registered in Sheet Master.',
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('tanker_user');
    localStorage.removeItem('tanker_token');
  };

  const switchRoleDemo = (role: UserRole) => {
    const demo = initialUsers.find((u) => u.role === role) || {
      id: `USR-DEMO-${role}`,
      name: `Demo ${role}`,
      email: `${role.toLowerCase().replace(/\s+/g, '')}@piramalpetroleum.com`,
      role,
      phone: '+91 98000 00000',
      department: 'Operations',
      status: 'Active',
    };
    setUser(demo);
    localStorage.setItem('tanker_user', JSON.stringify(demo));
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
        switchRoleDemo,
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
