import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminContextType {
  adminUser: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const stored = localStorage.getItem('adminUser');
      if (stored) {
        setAdminUser(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error checking admin auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      // For demo purposes, we'll use simple credential check
      // In production, you'd implement proper password hashing
      const { data: users, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !users) {
        return { error: 'Invalid credentials' };
      }

      // Simple password check for demo (in production, use bcrypt)
      if (email === 'admin@aisolutions.com' && password === 'admin123') {
        const user: AdminUser = {
          id: users.id,
          email: users.email,
          name: users.name,
          role: users.role
        };

        setAdminUser(user);
        localStorage.setItem('adminUser', JSON.stringify(user));
        return {};
      } else {
        return { error: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { error: 'Login failed' };
    }
  };

  const logout = () => {
    setAdminUser(null);
    localStorage.removeItem('adminUser');
  };

  const value = {
    adminUser,
    loading,
    login,
    logout,
    isAuthenticated: !!adminUser
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};