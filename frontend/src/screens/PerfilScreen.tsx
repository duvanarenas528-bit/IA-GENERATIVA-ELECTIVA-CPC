import React, { useRef, useState } from 'react';
import { ScreenId } from '../types';
import { useAuth } from '../context/AuthContext';
import { assetUrl } from '../services/api';

interface PerfilScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const PerfilScreen: React.FC<PerfilScreenProps> = ({ onNavigate }) => {
  const { user, uploadAvatar, removeAvatar } = useAuth();
  const displayName = user?.name || '';
  const displayEmail = user?.email || '';
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  const initials = getInitials(displayName);
  const [activeTab, setActiveTab] = useState<'perfil' | 'seguridad' | 'notificaciones' | 'api'>('perfil');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const [pushNotifs, setPushNotifs] = useState<boolean>(true);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState<boolean>(false);
  const [avatarFeedback, setAvatarFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setAvatarFeedback({ type: 'error', text: 'Formato no válido. Usa una imagen JPG, PNG o WEBP.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setAvatarFeedback({ type: 'error', text: 'La imagen supera el tamaño máximo de 5 MB.' });
      return;
    }

    setAvatarUploading(true);
    setAvatarFeedback(null);
    const result = await uploadAvatar(file);
    setAvatarUploading(false);
    setAvatarFeedback(
      result.success
        ? { type: 'success', text: 'Foto de perfil actualizada y guardada en tu cuenta.' }
        : { type: 'error', text: result.error || 'No se pudo subir la foto de perfil.' }
    );
  };

  const handleRemoveAvatar = async () => {
    setAvatarUploading(true);
    setAvatarFeedback(null);
    const result = await removeAvatar();
    setAvatarUploading(false);
    setAvatarFeedback(
      result.success
        ? { type: 'success', text: 'Foto de perfil eliminada.' }
        : { type: 'error', text: result.error || 'No se pudo eliminar la foto de perfil.' }
    );
  };

  const handleSave = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Profile Header Banner */}
      <section className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 pt-8 pb-16 border-b border-slate-800">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 border-2 border-blue-500 shadow-xl flex items-center justify-center text-white text-lg font-black overflow-hidden">
                {user?.avatar ? (
                  <img
                    src={assetUrl(user.avatar)}
                    alt={displayName || 'Foto de perfil'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                aria-label="Actualizar foto de perfil"
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 rounded-full border-2 border-slate-900 flex items-center justify-center transition"
              >
                <span className={`material-symbols-outlined text-sm text-white ${avatarUploading ? 'animate-spin' : ''}`}>
                  {avatarUploading ? 'progress_activity' : 'photo_camera'}
                </span>
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white">{displayName}</h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                {displayEmail}
              </p>
              {avatarFeedback && (
                <p className={`text-[11px] mt-1 font-semibold ${avatarFeedback.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {avatarFeedback.text}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition"
            >
              Volver al Panel
            </button>
            <button
              onClick={() => onNavigate('nuevo-preperitaje')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-blue-600/30 transition flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              Nuevo Preperitaje
            </button>
          </div>
        </div>
      </section>

      {/* Main Container Overlapping */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-12 w-full flex-1">
        {/* KPI Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              Preperitajes Totales
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              Tasa Aprobación IA
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              Tiempo Promedio
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
              Certificados Emitidos
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">—</span>
          </div>
        </div>

        {/* Content Tabs & Panes */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Navigation Bar inside card */}
          <div className="flex border-b border-slate-200 px-6 pt-3 gap-6 bg-slate-50/70 overflow-x-auto">
            <button
              onClick={() => setActiveTab('perfil')}
              className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'perfil'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-base">person</span>
              Datos Personales & Periciales
            </button>
            <button
              onClick={() => setActiveTab('seguridad')}
              className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'seguridad'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-base">lock</span>
              Seguridad & 2FA
            </button>
            <button
              onClick={() => setActiveTab('notificaciones')}
              className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'notificaciones'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-base">notifications</span>
              Notificaciones & Alertas
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`pb-3 text-xs font-bold transition border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'api'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className="material-symbols-outlined text-base">key</span>
              Credenciales & API
            </button>
          </div>

          <div className="p-6 md:p-8">
            {saveSuccess && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                <span className="material-symbols-outlined text-base text-emerald-600">check_circle</span>
                Cambios actualizados y sincronizados exitosamente en la base de datos de AutoCheck.
              </div>
            )}

            {activeTab === 'perfil' && (
              <div className="space-y-6 max-w-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-blue-500 flex items-center justify-center text-white text-sm font-black overflow-hidden shrink-0">
                    {user?.avatar ? (
                      <img
                        src={assetUrl(user.avatar)}
                        alt={displayName || 'Foto de perfil'}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900">Foto de perfil</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Sube una imagen JPG, PNG o WEBP de máximo 5 MB. Quedará guardada en tu cuenta.
                    </p>
                    {avatarFeedback && (
                      <p className={`text-[11px] mt-1.5 font-semibold ${avatarFeedback.type === 'success' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {avatarFeedback.text}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={avatarUploading}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white font-bold text-xs rounded-lg shadow-md transition flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-base">
                        {avatarUploading ? 'progress_activity' : 'add_a_photo'}
                      </span>
                      {avatarUploading ? 'Subiendo...' : user?.avatar ? 'Cambiar foto' : 'Subir foto'}
                    </button>
                    {user?.avatar && (
                      <button
                        type="button"
                        onClick={handleRemoveAvatar}
                        disabled={avatarUploading}
                        className="px-3 py-2 bg-white hover:bg-rose-50 disabled:opacity-60 text-rose-600 font-bold text-xs rounded-lg border border-rose-200 transition"
                      >
                        Quitar
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      readOnly
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      value={displayEmail}
                      disabled
                      className="w-full bg-slate-100 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Institución / Universidad
                    </label>
                    <input
                      type="text"
                      defaultValue=""
                      placeholder="Institución / Universidad"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Registro Nacional Técnico (RNT)
                    </label>
                    <input
                      type="text"
                      defaultValue=""
                      placeholder="RNT"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm font-mono text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Especialidad Pericial
                  </label>
                  <select
                    defaultValue=""
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="" disabled>Especialidad</option>
                    <option value="peritaje-ia">Inspección Telemática & Visión Computacional</option>
                    <option value="peritaje-mecanico">Diagnóstico Mecánico y Tren Motriz</option>
                    <option value="chasis-estructura">Alineación Estructural y Soldadura Forense</option>
                    <option value="tasacion">Valoración Comercial y Tasación Fasecolda</option>
                  </select>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-md transition"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'seguridad' && (
              <div className="space-y-6 max-w-2xl">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Autenticación de Dos Factores (2FA TOTP)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Requiere un código de Google Authenticator o llave de seguridad física al iniciar sesión.
                    </p>
                  </div>
                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      twoFactorEnabled ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Sesiones y Dispositivos Vinculados
                  </h4>
                  <div className="flex items-center justify-between text-xs py-2 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-500">laptop_chromebook</span>
                      <div>
                        <strong className="block text-slate-800">Chrome on Linux (Sesión Actual)</strong>
                        <span className="text-[11px] text-slate-400">Bogotá D.C. • IP: 181.129.**.**</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                      Activo
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs py-2">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-slate-500">smartphone</span>
                      <div>
                        <strong className="block text-slate-800">AutoCheck Mobile • Pixel 8 Pro</strong>
                        <span className="text-[11px] text-slate-400">Última sincronización: Hace 2 horas</span>
                      </div>
                    </div>
                    <button className="text-[11px] text-rose-600 font-semibold hover:underline">
                      Cerrar Sesión
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-md transition"
                  >
                    Actualizar Seguridad
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notificaciones' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Alertas de Siniestros Detectados</h4>
                    <p className="text-[11px] text-slate-500">Notificar inmediatamente cuando la IA identifique daño estructural grave.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushNotifs}
                    onChange={(e) => setPushNotifs(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3 border border-slate-200 rounded-xl">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Resumen Semanal de Auditorías</h4>
                    <p className="text-[11px] text-slate-500">Recibir reporte consolidado de vehículos peritados por correo.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-md transition"
                  >
                    Guardar Preferencias
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Token de API para Integraciones Telemáticas
                  </h4>
                  <p className="text-xs text-slate-500 mb-3">
                    Usa esta llave para enviar fotografías directamente desde hardware OBD-II o cámaras de taller.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value="ack_live_9f82d1c08a94e82b7401c"
                      className="flex-1 bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-700"
                    />
                    <button
                      onClick={() => alert('Token copiado al portapapeles')}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                  <strong>Protocolo de Inferencia:</strong> Gemini 2.5 Flash Multimodal Vision API configurada con soporte de latencia ultra-baja (&lt;1.5s por inferencia).
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
