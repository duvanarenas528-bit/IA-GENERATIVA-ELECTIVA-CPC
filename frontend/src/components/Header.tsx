/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ScreenId } from '../types';
import { useAuth } from '../context/AuthContext';
import { assetUrl } from '../services/api';
import { AutoCheckLogo } from './AutoCheckLogo';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  const { user, logout } = useAuth();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const navItems: { id: ScreenId; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Inicio', icon: 'home' },
    { id: 'nuevo-preperitaje', label: 'Nuevo Preperitaje', icon: 'add_circle' },
    { id: 'ficha-venta', label: 'Ficha de Venta', icon: 'description' },
    { id: 'analisis-vivo', label: 'Análisis en Vivo', icon: 'monitor_heart' },
    { id: 'guia-inspeccion', label: 'Guía de Inspección', icon: 'fact_check' },
  ];

  const handleLogout = async () => {
    setIsProfileMenuOpen(false);
    try {
      localStorage.removeItem('autocheck_preperitaje_draft');
      sessionStorage.removeItem('autocheck_preperitaje_draft');
    } catch {}
    await logout();
    onNavigate('login-user');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <AutoCheckLogo
              size="md"
              onClick={() => onNavigate('dashboard')}
              subtitleText="PLATAFORMA VEHICULAR IA"
            />
            
            {/* Main Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentScreen === item.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-3">
            {/* User Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <img
                  src={user?.avatar ? assetUrl(user.avatar) : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80'}
                  alt={user?.name || 'Usuario'}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user?.name || 'Usuario'}</p>
                  <p className="text-[10px] text-slate-500 leading-none mt-1">{user?.email || ''}</p>
                </div>
                <span className="material-symbols-outlined text-lg text-slate-400 hidden sm:block">
                  {isProfileMenuOpen ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onNavigate('perfil');
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">person</span>
                      Mi Perfil
                    </button>
                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
