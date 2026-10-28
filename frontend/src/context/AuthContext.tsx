import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '../types';
import {
  authMe,
  authLogin,
  authRegister,
  authLogout,
  authUploadAvatar,
  authDeleteAvatar,
  setUnauthorizedHandler,
} from '../services/api';

interface AuthContextType {
  user: UserAccount | null;
  isAuthenticated: boolean;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  uploadAvatar: (file: File) => Promise<{ success: boolean; error?: string }>;
  removeAvatar: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forceLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function toUserAccount(u: any): UserAccount {
  return {
    id: u.id,
    name: u.nombre || u.name,
    email: u.correo || u.email,
    avatar: u.avatar || undefined,
    role: u.role === 'admin' || u.role === 'perito' ? u.role : 'user',
    authProvider: 'local',
  };
}

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
          setUser(toUserAccount(me));
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
      setUser(toUserAccount(res.user));
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
      setUser(toUserAccount(res.user));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'No se pudo registrar' };
    }
  };

  const uploadAvatar = async (file: File): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authUploadAvatar(file);
      setUser((prev) => (prev ? { ...prev, avatar: res.user?.avatar || undefined } : prev));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'No se pudo subir la foto de perfil' };
    }
  };

  const removeAvatar = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await authDeleteAvatar();
      setUser((prev) => (prev ? { ...prev, avatar: undefined } : prev));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'No se pudo eliminar la foto de perfil' };
    }
  };

  const logout = async () => {
    await authLogout();
    try {
      localStorage.removeItem('autocheck_preperitaje_draft');
      sessionStorage.removeItem('autocheck_preperitaje_draft');
    } catch {}
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
        uploadAvatar,
        removeAvatar,
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
