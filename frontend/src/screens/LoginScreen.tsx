import React, { useState } from 'react';
import { ScreenId } from '../types';
import { useAuth } from '../context/AuthContext';
import { AutoCheckLogo } from '../components/AutoCheckLogo';
import { requestPasswordReset, resetPassword } from '../services/api';

type AuthMode = 'login' | 'register' | 'forgot' | 'reset';

interface LoginScreenProps {
  initialRole?: 'user' | 'admin';
  onNavigate: (screen: ScreenId) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ initialRole = 'user', onNavigate }) => {
  const { loginWithEmail, registerWithEmail } = useAuth();

  // Auth Mode: login, register, forgot password, reset password
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [issuedCode, setIssuedCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const switchMode = (mode: AuthMode) => {
    setAuthMode(mode);
    setErrorMsg('');
    setSuccessMsg('');
  };

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
      if (password.length < 8) {
        setErrorMsg('La contraseña debe tener al menos 8 caracteres');
        setIsLoading(false);
        return;
      }
      const res = await registerWithEmail(name, email, password);
      if (res.success) {
        setSuccessMsg('Cuenta creada con éxito');
      } else {
        setErrorMsg(res.error || 'No se pudo crear la cuenta');
      }
    } else if (authMode === 'login') {
      const res = await loginWithEmail(email, password);
      if (res.success) {
        setSuccessMsg('Bienvenido');
      } else {
        setErrorMsg(res.error || 'Correo o contraseña incorrectos');
      }
    } else if (authMode === 'forgot') {
      try {
        const res = await requestPasswordReset(email);
        setIssuedCode(res.code || '');
        setCode('');
        setSuccessMsg(res.message);
        setAuthMode('reset');
      } catch (err: any) {
        setErrorMsg(err.message || 'No se pudo solicitar el código');
      }
    } else {
      if (!/^\d{6}$/.test(code)) {
        setErrorMsg('El código debe tener 6 dígitos');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg('Las contraseñas no coinciden');
        setIsLoading(false);
        return;
      }
      if (password.length < 8) {
        setErrorMsg('La contraseña debe tener al menos 8 caracteres');
        setIsLoading(false);
        return;
      }
      try {
        const res = await resetPassword(code, password);
        setSuccessMsg(res.message || 'Contraseña actualizada. Inicia sesión con tu nueva contraseña.');
        setIssuedCode('');
        setCode('');
        setPassword('');
        setConfirmPassword('');
        setAuthMode('login');
      } catch (err: any) {
        setErrorMsg(err.message || 'No se pudo restablecer la contraseña');
      }
    }
    setIsLoading(false);
  };

  const titles: Record<AuthMode, { title: string; description: string }> = {
    login: {
      title: 'Iniciar Sesión',
      description: 'Ingresa a tu cuenta para gestionar tus diagnósticos y fichas de venta.',
    },
    register: {
      title: 'Crear Cuenta Nueva',
      description: 'Regístrate para realizar preperitajes con IA y controlar el historial de tu auto.',
    },
    forgot: {
      title: 'Recuperar Contraseña',
      description: 'Ingresa tu correo para generar un código de recuperación.',
    },
    reset: {
      title: 'Restablecer Contraseña',
      description: 'Ingresa el código de 6 dígitos y escribe tu nueva contraseña.',
    },
  };

  const submitLabel: Record<AuthMode, string> = {
    login: 'Iniciar Sesión',
    register: 'Crear Cuenta',
    forgot: 'Generar Código',
    reset: 'Guardar Nueva Contraseña',
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
              {titles[authMode].title}
            </h2>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {titles[authMode].description}
            </p>
          </div>

          {/* Mode Switcher Tabs: Iniciar Sesión vs Crear Cuenta */}
          {(authMode === 'login' || authMode === 'register') && (
            <div className="grid grid-cols-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => switchMode('login')}
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
                onClick={() => switchMode('register')}
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
          )}

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

          {/* Recovery code (development mode) */}
          {authMode === 'reset' && issuedCode && (
            <div className="p-4 bg-amber-950/50 border border-amber-800/70 rounded-xl space-y-2">
              <p className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
                Código de recuperación
              </p>
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-2xl font-black tracking-[0.3em] text-white">{issuedCode}</span>
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(issuedCode)}
                  className="px-2.5 py-1.5 rounded-lg border border-amber-700 text-amber-200 hover:bg-amber-900/40 transition text-[11px] font-bold flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">content_copy</span>
                  Copiar
                </button>
              </div>
              <p className="text-[10px] text-amber-200/70">
                Válido por 10 minutos y solo para un restablecimiento.
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Nombre Completo</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">person</span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition"
                    placeholder="Ingresa tu nombre y apellido"
                    required
                  />
                </div>
              </div>
            )}

            {authMode !== 'reset' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Correo Electrónico</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">mail</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition"
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
              </div>
            )}

            {authMode === 'reset' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Código de 6 Dígitos</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">pin</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm tracking-[0.3em] font-mono text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition"
                    placeholder="000000"
                    required
                  />
                </div>
              </div>
            )}

            {authMode !== 'forgot' && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  {authMode === 'reset' ? 'Nueva Contraseña' : 'Contraseña'}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">lock</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition"
                    placeholder={authMode === 'reset' ? 'Escribe tu nueva contraseña' : 'Ingresa tu contraseña'}
                    required
                  />
                </div>
              </div>
            )}

            {(authMode === 'register' || authMode === 'reset') && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">Confirmar Contraseña</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-lg">lock_reset</span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-500 transition"
                    placeholder="Repite tu contraseña"
                    required
                  />
                </div>
              </div>
            )}

            {authMode === 'login' && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-600"
                  />
                  <span>Recordarme</span>
                </label>
                <button
                  type="button"
                  onClick={() => switchMode('forgot')}
                  className="text-blue-400 hover:text-blue-300 font-semibold transition"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm transition shadow-lg shadow-blue-900/20 active:scale-[0.99]"
            >
              {isLoading ? 'Procesando...' : submitLabel[authMode]}
            </button>

            {(authMode === 'forgot' || authMode === 'reset') && (
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="w-full py-2 text-xs text-slate-400 hover:text-white font-semibold transition flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Volver al inicio de sesión
              </button>
            )}
          </form>
        </div>
      </main>

      <footer className="px-6 py-4 text-center text-[10px] text-slate-600 z-10">
        <p>© 2026 AutoCheck AI. Plataforma de Preperitaje y Diagnóstico Vehicular Inteligente.</p>
      </footer>
    </div>
  );
};
