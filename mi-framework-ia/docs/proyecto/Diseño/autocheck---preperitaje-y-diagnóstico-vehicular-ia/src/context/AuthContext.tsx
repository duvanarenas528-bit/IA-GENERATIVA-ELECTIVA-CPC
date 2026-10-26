import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '../types';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  quickSwitchUser: (type: 'user' | 'admin') => void;
}

const defaultUser: UserAccount = {
  id: 'usr_leni_01',
  name: 'Leni Murillo',
  email: 'lenimur03@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  role: 'user',
  authProvider: 'google',
  institution: 'Facultad de Ingeniería de Sistemas • UNIMINUTO',
  licenseNumber: 'RNT-48291-BOG',
};

const defaultAdmin: UserAccount = {
  id: 'adm_duban_01',
  name: 'Ing. Duban Tibaquira',
  email: 'duban.tibaquira@uniminuto.edu.co',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
  role: 'admin',
  authProvider: 'google',
  institution: 'Facultad de Ingeniería de Sistemas • UNIMINUTO',
  licenseNumber: 'RNT-PER-9021',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('autocheck_active_user');
      return saved ? JSON.parse(saved) : defaultUser;
    } catch {
      return defaultUser;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('autocheck_active_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('autocheck_active_user');
    }
  }, [user]);

  const loginWithGoogle = async () => {
    // Simulated Google OAuth authorization flow
    await new Promise((r) => setTimeout(r, 600));
    const googleUser: UserAccount = {
      id: `usr_google_${Date.now()}`,
      name: 'Leni Murillo',
      email: 'lenimur03@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      role: 'user',
      authProvider: 'google',
      institution: 'Facultad de Ingeniería de Sistemas • UNIMINUTO',
      licenseNumber: 'RNT-48291-BOG',
    };
    setUser(googleUser);
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 500));
    if (!email || !pass) {
      return { success: false, error: 'Por favor ingresa correo y contraseña' };
    }
    
    // Check if admin / auditor email
    if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('duban') || email.toLowerCase().includes('tibaquira')) {
      setUser(defaultAdmin);
      return { success: true };
    }

    const localUser: UserAccount = {
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      role: 'user',
      authProvider: 'local',
      institution: 'Usuario Propietario AutoCheck',
    };
    setUser(localUser);
    return { success: true };
  };

  const registerWithEmail = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 600));
    if (!name || !email || !pass) {
      return { success: false, error: 'Todos los campos son requeridos' };
    }
    if (pass.length < 6) {
      return { success: false, error: 'La contraseña debe tener al menos 6 caracteres' };
    }

    const newUser: UserAccount = {
      id: `usr_reg_${Date.now()}`,
      name,
      email,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      role: 'user',
      authProvider: 'local',
      institution: 'Propietario / Comprador Particular',
    };
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const quickSwitchUser = (type: 'user' | 'admin') => {
    if (type === 'admin') {
      setUser(defaultAdmin);
    } else {
      setUser(defaultUser);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        logout,
        quickSwitchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
