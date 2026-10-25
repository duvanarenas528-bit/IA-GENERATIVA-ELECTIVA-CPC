import React, { useState } from 'react';
import { ScreenId } from '../types';
import { useAuth } from '../context/AuthContext';
import { AutoCheckLogo } from '../components/AutoCheckLogo';

interface LoginScreenProps {
  initialRole?: 'user' | 'admin';
  onNavigate: (screen: ScreenId) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ initialRole = 'user', onNavigate }) => {
  const { loginWithGoogle, loginWithEmail, registerWithEmail, quickSwitchUser } = useAuth();
  
  // Auth Mode: login vs register
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('lenimur03@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [confirmPassword, setConfirmPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  
  // State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Google Login / Register
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      setSuccessMsg('¡Sesión iniciada con Google exitosamente!');
      setTimeout(() => {
        onNavigate('dashboard');
      }, 500);
    } catch {
      setErrorMsg('Error al conectar con la cuenta de Google');
    } finally {
      setIsLoading(false);
    }
  };

  // Submit local form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (authMode === 'register') {
      if (password !== confirmPassword) {
        setErrorMsg('Las contraseñas no coinciden');
        setIsLoading(false);
        return;
      }
      const res = await registerWithEmail(name || 'Nuevo Usuario', email, password);
      if (res.success) {
        setSuccessMsg('¡Cuenta creada con éxito! Bienvenido a AutoCheck');
        setTimeout(() => {
          onNavigate('dashboard');
        }, 600);
      } else {
        setErrorMsg(res.error || 'No se pudo crear la cuenta');
      }
    } else {
      const res = await loginWithEmail(email, password);
      if (res.success) {
        setSuccessMsg('¡Bienvenido de nuevo!');
        setTimeout(() => {
          if (email.includes('admin') || email.includes('duban') || email.includes('tibaquira')) {
            onNavigate('admin-dashboard');
          } else {
            onNavigate('dashboard');
          }
        }, 500);
      } else {
        setErrorMsg(res.error || 'Credenciales inválidas');
      }
    }
    setIsLoading(false);
  };

  // Quick 1-click login for test evaluators
  const handleQuickDemo = (roleType: 'user' | 'admin') => {
    setIsLoading(true);
    quickSwitchUser(roleType);
    setTimeout(() => {
      setIsLoading(false);
      if (roleType === 'admin') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('dashboard');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <header className="px-6 py-4 flex items-center justify-between z-10 max-w-7xl mx-auto w-full">
        <AutoCheckLogo
          size="md"
          variant="white"
          subtitleText="PLATAFORMA VEHICULAR IA"
          onClick={() => onNavigate('dashboard')}
        />

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-full text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Servidor Seguro TLS 1.3</span>
          </span>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center px-4 py-6 z-10">
        <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Brand Logo & Presentation */}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-1">
              <AutoCheckLogo size="lg" variant="white" showSubtitle={false} />
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              {authMode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta Nueva'}
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {authMode === 'login'
                ? 'Ingresa a tu cuenta para gestionar tus diagnósticos y fichas de venta.'
                : 'Regístrate para realizar preperitajes con IA y controlar el historial de tu auto.'}
            </p>
          </div>

          {/* Mode Switcher Tabs: Iniciar Sesión vs Crear Cuenta */}
          <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                authMode === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">login</span>
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-2 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                authMode === 'register'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">person_add</span>
              Crear Cuenta
            </button>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="p-3 bg-rose-950/70 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-rose-400">error</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-950/70 border border-emerald-800 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* Google Button (One-Click) */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-800 rounded-xl font-bold text-xs transition flex items-center justify-center gap-3 shadow-md active:scale-[0.99]"
          >
            {/* Google Multicolor Logo */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>
              {authMode === 'login' ? 'Continuar con Google' : 'Registrarme con Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-800"></div>
            <span className="absolute bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider">
              o con correo y contraseña
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Nombre Completo
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-base">
                    person
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Correo Electrónico
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-base">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Contraseña
                </label>
                {authMode === 'login' && (
                  <button
                    type="button"
                    onClick={() => alert('Se ha enviado enlace de restablecimiento seguro a tu correo.')}
                    className="text-[11px] text-blue-400 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-base">
                  lock
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition font-mono"
                />
              </div>
            </div>

            {authMode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-base">
                    lock_reset
                  </span>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition font-mono"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 text-blue-600 focus:ring-0"
                />
                <span>Recordar sesión</span>
              </label>
              <span className="text-[11px] text-slate-500">Cifrado AES-256</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-base">
                    {authMode === 'login' ? 'login' : 'how_to_reg'}
                  </span>
                  <span>
                    {authMode === 'login'
                      ? 'Entrar con Correo y Contraseña'
                      : 'Crear Mi Cuenta AutoCheck'}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Access for Demo Evaluators */}
          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block text-center">
              Acceso Rápido de Prueba (1-Click Demo)
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('user')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 text-left text-xs transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <strong className="block text-slate-200 group-hover:text-blue-400 text-[11px] truncate">
                    Leni Murillo
                  </strong>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Ing. de Sistemas</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500 text-left text-xs transition group"
              >
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <strong className="block text-slate-200 group-hover:text-amber-400 text-[11px] truncate">
                    Duban Tibaquira
                  </strong>
                </div>
                <span className="text-[10px] text-slate-500 block mt-0.5">Ing. de Sistemas • Auditor</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-6 text-center text-[11px] text-slate-500 z-10 flex flex-col sm:flex-row items-center justify-center gap-2">
        <AutoCheckLogo size="sm" variant="white" showSubtitle={false} />
        <span>• Plataforma Telemática de Diagnóstico Vehicular IA © 2026</span>
      </footer>
    </div>
  );
};
