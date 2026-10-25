import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '../types';
import { authMe, authLogin, authRegister, authLogout, setUnauthorizedHandler } from '../services/api';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forceLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
      window.location.hash = '#/login';
      // also try to navigate if using state-based routing
      window.dispatchEvent(new Event('autocheck:unauthorized'));
    });
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const me = await authMe();
        if (me) {
          setUser({
            id: me.id,
            name: me.nombre || me.name,
            email: me.correo || me.email,
            role: 'user',
            authProvider: 'local',
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authLogin(email, pass);
      const u = res.user;
      setUser({
        id: u.id,
        name: u.nombre || u.name,
        email: u.correo || u.email,
        role: 'user',
        authProvider: 'local',
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message === 'UNAUTHORIZED' ? 'Correo o contraseña incorrectos' : (e.message || 'Correo o contraseña incorrectos') };
    }
  };

  const registerWithEmail = async (name: string, email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      if (pass.length < 8) {
        return { success: false, error: 'La contraseña debe tener al menos 8 caracteres' };
      }
      const res = await authRegister(name, email, pass);
      const u = res.user;
      setUser({
        id: u.id,
        name: u.nombre || u.name,
        email: u.correo || u.email,
        role: 'user',
        authProvider: 'local',
      });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'No se pudo registrar' };
    }
  };

  const logout = async () => {
    await authLogout();
    setUser(null);
  };

  const forceLogout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        loginWithEmail,
        registerWithEmail,
        logout,
        forceLogout,
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
