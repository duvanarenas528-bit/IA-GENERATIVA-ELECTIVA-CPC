import React, { useState } from 'react';
import { ScreenId } from '../types';
import { AutoCheckLogo } from './AutoCheckLogo';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentScreen, onNavigate }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const isNavActive = (path: ScreenId) => {
    if (path === 'informe-detallado' && (currentScreen === 'informe-detallado' || currentScreen === 'visor-a4')) {
      return true;
    }
    if (path === 'nuevo-preperitaje' && (currentScreen === 'nuevo-preperitaje' || currentScreen === 'analisis-vivo')) {
      return true;
    }
    return currentScreen === path;
  };

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-[0_1px_8px_rgba(0,0,0,0.03)] font-sans">
      <div className="h-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Brand with AutoCheckLogo */}
        <div className="flex items-center gap-6 xl:gap-8">
          <AutoCheckLogo
            size="md"
            variant="light"
            subtitleText="PREPERITAJE VEHICULAR IA"
            onClick={() => onNavigate('dashboard')}
          />

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 text-xs">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                isNavActive('dashboard')
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-base">dashboard</span>
              <span>Panel Principal</span>
            </button>

            <button
              onClick={() => onNavigate('nuevo-preperitaje')}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                isNavActive('nuevo-preperitaje')
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-base">add_circle</span>
              <span>Nuevo Preperitaje</span>
            </button>

            <button
              onClick={() => onNavigate('informe-detallado')}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                isNavActive('informe-detallado')
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-base">analytics</span>
              <span>Informe con IA</span>
            </button>

            {/* NEW: Ficha para Venta */}
            <button
              onClick={() => onNavigate('ficha-venta')}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                isNavActive('ficha-venta')
                  ? 'bg-emerald-50 text-emerald-800 shadow-sm ring-1 ring-emerald-300'
                  : 'text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/60'
              }`}
            >
              <span className="material-symbols-outlined text-base text-emerald-600">verified</span>
              <span>Ficha de Venta / Traspaso</span>
            </button>

            <button
              onClick={() => onNavigate('guia-inspeccion')}
              className={`px-3 py-2 rounded-xl font-bold transition flex items-center gap-1.5 ${
                isNavActive('guia-inspeccion')
                  ? 'bg-blue-50 text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-base">menu_book</span>
              <span>Guía Técnica</span>
            </button>
          </nav>
        </div>

        {/* Right Side: User Profile / Auth State */}
        <div className="flex items-center gap-3">
          {/* Quick Action Button */}
          <button
            onClick={() => onNavigate('nuevo-preperitaje')}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/20 transition active:scale-95"
          >
            <span className="material-symbols-outlined text-base">auto_awesome</span>
            <span>Evaluar Vehículo</span>
          </button>

          {/* User Profile or Login */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-2xl hover:bg-slate-100 transition border border-slate-200"
              >
                <img
                  src={
                    user.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80'
                  }
                  alt={user.name}
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-none truncate max-w-[120px]">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {user.role === 'admin' ? 'Auditor HITL' : 'Propietario'}
                  </span>
                </div>
                <span className="material-symbols-outlined text-slate-400 text-base">expand_more</span>
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-xs">
                  <div className="p-2.5 border-b border-slate-100 mb-1">
                    <strong className="block text-slate-900 truncate">{user.name}</strong>
                    <span className="text-[11px] text-slate-400 font-mono truncate block">{user.email}</span>
                  </div>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('perfil');
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <span className="material-symbols-outlined text-base text-blue-600">person</span>
                    Mi Perfil & Ajustes
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('ficha-venta');
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <span className="material-symbols-outlined text-base text-emerald-600">verified</span>
                    Ficha de Venta / Aceite & Llantas
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onNavigate('admin-dashboard');
                    }}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                  >
                    <span className="material-symbols-outlined text-base text-amber-600">admin_panel_settings</span>
                    Panel Administrativo
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                        onNavigate('login-user');
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-rose-50 text-rose-600 flex items-center gap-2 font-bold"
                    >
                      <span className="material-symbols-outlined text-base">logout</span>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onNavigate('login-user')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-base">login</span>
              <span>Iniciar Sesión</span>
            </button>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-xl hover:bg-slate-100 text-slate-700 lg:hidden"
          >
            <span className="material-symbols-outlined text-2xl">
              {showMobileMenu ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {showMobileMenu && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 text-xs">
          <button
            onClick={() => {
              setShowMobileMenu(false);
              onNavigate('dashboard');
            }}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2 font-bold text-slate-800"
          >
            <span className="material-symbols-outlined text-blue-600">dashboard</span>
            Panel Principal
          </button>
          <button
            onClick={() => {
              setShowMobileMenu(false);
              onNavigate('nuevo-preperitaje');
            }}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2 font-bold text-slate-800"
          >
            <span className="material-symbols-outlined text-blue-600">add_circle</span>
            Nuevo Preperitaje Asistido
          </button>
          <button
            onClick={() => {
              setShowMobileMenu(false);
              onNavigate('ficha-venta');
            }}
            className="w-full text-left p-2.5 rounded-xl bg-emerald-50 text-emerald-900 flex items-center gap-2 font-bold"
          >
            <span className="material-symbols-outlined text-emerald-600">verified</span>
            Ficha de Venta / Control Comprador
          </button>
          <button
            onClick={() => {
              setShowMobileMenu(false);
              onNavigate('informe-detallado');
            }}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2 font-bold text-slate-800"
          >
            <span className="material-symbols-outlined text-blue-600">analytics</span>
            Informe con IA
          </button>
          <button
            onClick={() => {
              setShowMobileMenu(false);
              onNavigate('guia-inspeccion');
            }}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center gap-2 font-bold text-slate-800"
          >
            <span className="material-symbols-outlined text-blue-600">menu_book</span>
            Guía de Inspección
          </button>
        </div>
      )}
    </header>
  );
};
