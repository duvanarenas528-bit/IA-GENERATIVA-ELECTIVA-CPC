import React, { useState } from 'react';
import { ScreenId } from '../types';

interface GlobalScreenSwitcherProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
}

export const GlobalScreenSwitcher: React.FC<GlobalScreenSwitcherProps> = ({ currentScreen, onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const screens: { id: ScreenId; label: string; group: 'citizen' | 'admin'; badge?: string }[] = [
    { id: 'dashboard', label: '1. Panel de Control (Consola Central)', group: 'citizen' },
    { id: 'nuevo-preperitaje', label: '2. Nuevo Preperitaje (Cuestionario & Fotos)', group: 'citizen', badge: 'Nuevo' },
    { id: 'ficha-venta', label: '3. Ficha Venta / Aceite & Llantas (Comprador)', group: 'citizen', badge: 'Venta' },
    { id: 'analisis-vivo', label: '4. Análisis IA en Tiempo Real (Visor CV)', group: 'citizen', badge: 'Live' },
    { id: 'informe-detallado', label: '5. Informe de Preperitaje Detallado con IA', group: 'citizen' },
    { id: 'visor-a4', label: '6. Visor A4 Certificado Oficial (PDF/Hash)', group: 'citizen', badge: 'A4' },
    { id: 'guia-inspeccion', label: '7. Guía Fotográfica Técnica (8 Tomas)', group: 'citizen' },
    { id: 'perfil', label: '8. Mi Perfil & Configuración', group: 'citizen' },
    { id: 'login-user', label: '9. Acceso / Registro Google & Contraseña', group: 'citizen', badge: 'Google' },
    { id: 'admin-dashboard', label: '10. Consola General Admin & Supervisión', group: 'admin' },
    { id: 'admin-auditoria', label: '11. Auditoría Humana & Calidad (HITL)', group: 'admin', badge: 'HITL' },
    { id: 'admin-metricas', label: '12. Métricas de Desempeño del Modelo IA', group: 'admin' },
    { id: 'login-admin', label: '13. Gobernanza IA & Acceso 2FA UNIMINUTO', group: 'admin', badge: 'TLS 1.3' },
  ];

  return (
    <div className="fixed bottom-5 right-5 z-50 print:hidden">
      {isOpen ? (
        <div className="bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/50 rounded-2xl shadow-2xl p-4 w-80 sm:w-96 flex flex-col gap-3 max-h-[85vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center justify-between border-b border-surface-container pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse"></span>
              <span className="font-headline-sm text-headline-sm text-primary text-[15px]">Navegador de Pantallas</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-surface-container rounded-lg text-outline transition-colors cursor-pointer"
              title="Minimizar navegador"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-1">
              Portal Ciudadano & Diagnósticos
            </span>
            <div className="grid grid-cols-1 gap-1">
              {screens
                .filter((s) => s.group === 'citizen')
                .map((screen) => (
                  <button
                    key={screen.id}
                    onClick={() => {
                      onNavigate(screen.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between text-left px-3 py-2 rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
                      currentScreen === screen.id
                        ? 'bg-primary text-on-primary font-semibold shadow-xs'
                        : 'text-on-surface hover:bg-surface-container-low'
                    }`}
                    type="button"
                  >
                    <span className="truncate pr-2">{screen.label}</span>
                    {screen.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                          currentScreen === screen.id
                            ? 'bg-surface-container-lowest/25 text-white'
                            : 'bg-surface-container-high text-primary'
                        }`}
                      >
                        {screen.badge}
                      </span>
                    )}
                  </button>
                ))}
            </div>

            <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline px-1 pt-2">
              Investigación & Supervisión UNIMINUTO
            </span>
            <div className="grid grid-cols-1 gap-1">
              {screens
                .filter((s) => s.group === 'admin')
                .map((screen) => (
                  <button
                    key={screen.id}
                    onClick={() => {
                      onNavigate(screen.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between text-left px-3 py-2 rounded-lg font-label-md text-label-md transition-colors cursor-pointer ${
                      currentScreen === screen.id
                        ? 'bg-secondary text-on-primary font-semibold shadow-xs'
                        : 'text-on-surface hover:bg-surface-container-low'
                    }`}
                    type="button"
                  >
                    <span className="truncate pr-2">{screen.label}</span>
                    {screen.badge && (
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono shrink-0 ${
                          currentScreen === screen.id
                            ? 'bg-surface-container-lowest/25 text-white'
                            : 'bg-secondary-fixed text-on-secondary-fixed'
                        }`}
                      >
                        {screen.badge}
                      </span>
                    )}
                  </button>
                ))}
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary-container text-on-primary px-3.5 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer font-label-md text-label-md border border-white/20"
          type="button"
          title="Ver todas las pantallas del sistema"
        >
          <span className="material-symbols-outlined text-[20px] text-tertiary-fixed">layers</span>
          <span>12 Pantallas</span>
          <span className="w-2 h-2 rounded-full bg-secondary-container"></span>
        </button>
      )}
    </div>
  );
};
