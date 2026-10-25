import React from 'react';
import { ScreenId } from '../types';
import { AutoCheckLogo } from './AutoCheckLogo';

interface AdminLayoutProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentScreen, onNavigate, children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Fixed Admin Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-50 flex flex-col justify-between pt-4 pb-6">
        <div className="flex flex-col gap-6">
          {/* Logo & Brand Header */}
          <div className="px-4">
            <AutoCheckLogo
              size="md"
              variant="white"
              subtitleText="PANEL DE ADMINISTRACIÓN"
              onClick={() => onNavigate('admin-dashboard')}
            />
          </div>

          {/* Gemini API Live Status Pill */}
          <div className="px-4">
            <div className="p-2.5 bg-surface-container-low rounded-lg flex items-center justify-between border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed-dim opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-tertiary-container"></span>
                </span>
                <span className="font-label-sm text-label-sm text-on-surface font-semibold">API Gemini 1.5 Pro</span>
              </div>
              <span className="font-label-sm text-label-sm text-tertiary-container bg-surface-container-lowest px-1.5 py-0.5 rounded font-bold">
                Operativo
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-3">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-label-lg text-label-lg transition-colors text-left cursor-pointer ${
                currentScreen === 'admin-dashboard'
                  ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">dashboard</span>
              <span>Consola General</span>
            </button>

            <button
              onClick={() => onNavigate('admin-auditoria')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-label-lg text-label-lg transition-colors text-left cursor-pointer ${
                currentScreen === 'admin-auditoria'
                  ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">verified_user</span>
              <span>Auditoría de Peritajes</span>
            </button>

            <button
              onClick={() => onNavigate('admin-metricas')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-label-lg text-label-lg transition-colors text-left cursor-pointer ${
                currentScreen === 'admin-metricas'
                  ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">analytics</span>
              <span>Métricas Modelo IA</span>
            </button>

            <button
              onClick={() => onNavigate('ficha-venta')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-bold transition-colors text-left cursor-pointer ${
                currentScreen === 'ficha-venta'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px] text-emerald-400">verified</span>
              <span>Ficha Venta (Aceite/Llantas)</span>
            </button>

            <button
              onClick={() => onNavigate('login-admin')}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg font-label-lg text-label-lg transition-colors text-left cursor-pointer ${
                currentScreen === 'login-admin'
                  ? 'bg-primary-container text-on-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">vpn_key</span>
              <span>Gobernanza & 2FA</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer & Return to App */}
        <div className="px-4 flex flex-col gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-md text-label-md transition-colors cursor-pointer border border-outline-variant/40"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Volver a Vista Ciudadano</span>
          </button>

          <div className="p-3 bg-surface-container-low rounded-lg border border-outline-variant/30">
            <p className="font-label-sm text-label-sm text-outline uppercase tracking-wider mb-1">Entorno de Investigación</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-tight">
              Facultad de Ingeniería • Red Diagnóstico IA v2.4.0
            </p>
          </div>

          <div className="flex items-center justify-between text-outline px-1 font-label-sm text-label-sm">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">security</span> TLS 1.3 Audit
            </span>
            <span className="font-label-sm text-label-sm text-outline font-semibold">UNIMINUTO</span>
          </div>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="pl-64">
        {/* Admin Top Header */}
        <header className="fixed top-0 left-64 right-0 h-16 bg-surface/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-6 border-b border-outline-variant/30">
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-1.5 bg-surface-container-low px-3 py-1 rounded-lg text-on-surface-variant font-label-sm text-label-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px] text-primary">science</span>
              <span>Nodo de Investigación Activo: <strong className="text-on-surface">Lab-AutoIA-Bogotá</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <button
                aria-label="Buscar en la consola"
                className="p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">search</span>
              </button>
              <div className="relative">
                <button
                  aria-label="Notificaciones de sistema"
                  className="relative p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high rounded-lg transition-colors"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-surface"></span>
                </button>
              </div>
            </div>

            <div className="h-6 w-px bg-surface-container-highest"></div>

            <div className="flex items-center gap-2.5">
              <img
                alt="Profile Admin"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-primary/20"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTK00ofs4U-wOCT9ucspzQJLJlK-YLEML6F4HEf1PjvUJlFvO7OTj_ubsZ0k7wRijI8r-I4GRMKmVruEfnpxNOqp4GgjrDo-qAWXHUhSNI1m3DSKAagFmj1po7IamVsZ4vYNNGUeZZLGYuqaORn7PMHCPZfu2mzFaS8VlW0mbqUTeIUPLRglgkBNghWZKLOkcQVvdKoPUvhHS3nVi6QTKEb0718iDwex6GTbKrL-qyA6I3lXPyVFwr"
              />
              <div className="flex flex-col text-left">
                <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">Ing. Investigador UNIMINUTO</span>
                <span className="font-label-sm text-label-sm text-outline leading-tight">Administrador Principal</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="relative pt-16 bg-background w-full min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};
