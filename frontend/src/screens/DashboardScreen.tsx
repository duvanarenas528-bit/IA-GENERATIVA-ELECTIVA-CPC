import React, { useEffect, useState } from 'react';
import { ScreenId } from '../types';
import { useAuth } from '../context/AuthContext';
import { assetUrl, getDashboardStats, listPreperitajes } from '../services/api';
import { openReport } from '../services/navigation';

interface DashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'completed' | 'alerts'>('all');
  const [stats, setStats] = useState({ total: 0, completados: 0, conObservaciones: 0, alertas: 0 });
  const [preperitajes, setPreperitajes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const s = await getDashboardStats();
        setStats(s.stats || { total: 0, completados: 0, conObservaciones: 0, alertas: 0 });
        const p = await listPreperitajes();
        setPreperitajes(p.preperitajes || []);
      } catch {
        setStats({ total: 0, completados: 0, conObservaciones: 0, alertas: 0 });
        setPreperitajes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="w-full pt-20 bg-surface min-h-[calc(100vh-140px)]">
      {/* Breadcrumb */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
          <span className="material-symbols-outlined text-label-md">home</span>
          <span>/</span>
          <span className="text-outline">AutoCheck Web</span>
          <span>/</span>
          <span className="text-primary font-bold">Consola Central</span>
        </nav>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pb-10">
        {/* Hero / Welcome Banner */}
        <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary-container to-secondary p-6 md:p-8 text-on-primary shadow-md mb-6">
          <div className="absolute -right-12 -top-12 w-96 h-96 rounded-full bg-secondary-container/10 blur-3xl pointer-events-none"></div>
          <div className="absolute right-1/4 -bottom-10 w-64 h-64 rounded-full bg-tertiary-fixed/10 blur-2xl pointer-events-none"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-lowest/15 backdrop-blur-md text-on-primary text-label-sm font-label-sm mb-3">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping"></span>
                <span>Motor Neuronal Gemini Flash Vision v2.4 Activo</span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-primary tracking-tight">
                Bienvenido de nuevo, {user?.name || ''}
              </h1>
              <p className="font-body-lg text-body-lg text-primary-fixed mt-1">
                Realiza diagnósticos preliminares de vehículos con IA antes de un peritaje oficial. Identifica repintados, desgastes atípicos y desajustes de carrocería en minutos.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => onNavigate('nuevo-preperitaje')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-surface-container-lowest text-primary hover:bg-surface-container-low font-bold text-xs shadow-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-base text-primary">add_circle</span>
                <span>+ Nuevo Preperitaje</span>
              </button>
              <button
                onClick={() => onNavigate('ficha-venta')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-base">verified</span>
                <span>Ficha de Venta (Aceite/Llantas)</span>
              </button>
              <button
                onClick={() => onNavigate('guia-inspeccion')}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-surface-container-lowest/10 hover:bg-surface-container-lowest/20 backdrop-blur text-on-primary font-bold text-xs transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-base">menu_book</span>
                <span>Guía</span>
              </button>
            </div>
          </div>
        </section>

        {/* Quick KPIs & Metrics Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Metric 1 */}
          <div className="flex flex-col justify-between p-5 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-md text-label-md text-outline uppercase tracking-wider">Preperitajes Realizados</span>
              <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[22px]">directions_car</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-on-surface">{stats.total}</span>
            </div>
            <span className="font-body-sm text-body-sm text-outline mt-1">Vehículos registrados y analizados</span>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col justify-between p-5 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-md text-label-md text-outline uppercase tracking-wider">Ahorro Estimado</span>
              <div className="w-10 h-10 rounded-lg bg-tertiary-fixed/40 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[22px]">savings</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-on-surface">—</span>
            </div>
            <span className="font-body-sm text-body-sm text-outline mt-1">No medible</span>
          </div>

          {/* Metric 3 */}
          <div className="flex flex-col justify-between p-5 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-md text-label-md text-outline uppercase tracking-wider">Alertas Clave</span>
              <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-error">
                <span className="material-symbols-outlined text-[22px]">warning</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-on-surface">{stats.alertas}</span>
              <span className="font-label-md text-label-md text-outline">detectadas</span>
            </div>
            <span className="font-body-sm text-body-sm text-outline mt-1">Repintados y anomalías mecánicas</span>
          </div>

          {/* Metric 4 */}
          <div className="flex flex-col justify-between p-5 rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30">
            <div className="flex items-center justify-between mb-3">
              <span className="font-label-md text-label-md text-outline uppercase tracking-wider">Precisión IA Estimada</span>
              <div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">psychology</span>
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline-lg text-headline-lg text-on-surface">—</span>
              <span className="font-label-sm text-label-sm text-outline">F-Score</span>
            </div>
            <span className="font-body-sm text-body-sm text-outline mt-1">No medible</span>
          </div>
        </section>

        {/* Main Content Split: Diagnostic Cards & Sidebar Guide */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Primary Diagnostics Column (8 cols) */}
          <section className="lg:col-span-8 flex flex-col gap-6">
            {/* Section Header with Interactive Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Mis Vehículos y Diagnósticos Recientes</h2>
                <p className="font-body-sm text-body-sm text-outline">Historial de escaneos fotográficos y análisis estructurales</p>
              </div>

              {/* Category Filters */}
              <div className="flex items-center gap-1.5 bg-surface-container-low p-1 rounded-full border border-outline-variant/30">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1 rounded-full font-label-md text-label-md transition-colors cursor-pointer ${
                    filter === 'all' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  Todos ({preperitajes.length})
                </button>
                <button
                  onClick={() => setFilter('completed')}
                  className={`px-3 py-1 rounded-full font-label-md text-label-md transition-colors cursor-pointer ${
                    filter === 'completed' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  Completados
                </button>
                <button
                  onClick={() => setFilter('alerts')}
                  className={`px-3 py-1 rounded-full font-label-md text-label-md transition-colors cursor-pointer ${
                    filter === 'alerts' ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                  type="button"
                >
                  Con Observaciones
                </button>
              </div>
            </div>

            {/* Vehículos */}
            {preperitajes.length === 0 && !loading && (
              <div className="p-8 bg-white border border-slate-200 rounded-3xl text-center space-y-3 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-2xl">garage</span>
                </div>
                <h3 className="text-base font-bold text-slate-900">Aún no tienes vehículos. Crea tu primer preperitaje</h3>
                <div className="flex justify-center gap-2 pt-2">
                  <button
                    onClick={() => onNavigate('nuevo-preperitaje')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow"
                  >
                    + Nuevo Preperitaje
                  </button>
                </div>
              </div>
            )}

            {preperitajes.length > 0 && (
              <div className="flex flex-col gap-4">
                {preperitajes.map((v: any) => (
                  <article key={v.id} className="group rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all overflow-hidden border border-outline-variant/30">
                    <div className="grid grid-cols-1 sm:grid-cols-12">
                      <div className="relative sm:col-span-4 h-44 sm:h-auto min-h-[180px] bg-slate-100 overflow-hidden">
                        {v.fotoPrincipalUrl ? (
                          <img
                            src={assetUrl(v.fotoPrincipalUrl)}
                            alt={`${v.marca || ''} ${v.linea || v.modelo || ''} ${v.placa || ''}`.trim()}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full min-h-[180px] flex flex-col items-center justify-center gap-1.5 text-slate-400">
                            <span className="material-symbols-outlined text-4xl">directions_car</span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider">Sin foto registrada</span>
                          </div>
                        )}

                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-md text-white font-label-sm text-label-sm uppercase tracking-wider">
                          {v.placa}
                        </div>

                        {v.fotoPrincipalEtiqueta && (
                          <div className="absolute bottom-2 left-2 right-2 px-2 py-1 rounded bg-slate-900/70 backdrop-blur text-white text-[10px] font-semibold truncate">
                            {v.fotoPrincipalEtiqueta}
                          </div>
                        )}

                        {v.estado === 'completado' && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          </div>
                        )}
                      </div>

                      <div className="sm:col-span-8 p-5 md:p-6 flex flex-col justify-between gap-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap text-label-sm font-label-sm text-outline">
                              <span>{v.kilometraje ? `${v.kilometraje} km` : 'km N/D'}</span>
                              <span>•</span>
                              <span>Modelo {v.anio || 'N/D'}</span>
                              {v.combustible && (
                                <>
                                  <span>•</span>
                                  <span className="capitalize">{v.combustible}</span>
                                </>
                              )}
                            </div>
                            <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5 truncate">
                              {v.marca || ''} {v.linea || v.modelo || ''}
                            </h3>
                            {v.color && (
                              <p className="font-body-sm text-body-sm text-outline mt-1 capitalize">Color {v.color}</p>
                            )}
                          </div>

                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-label-sm text-label-sm font-bold shrink-0 ${
                              v.estado === 'completado'
                                ? 'bg-tertiary-fixed/40 text-tertiary'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {v.estado === 'completado' ? 'task_alt' : 'edit_note'}
                            </span>
                            {v.estado === 'completado' ? 'Completado' : 'Borrador'}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-outline-variant/30">
                          <span className="font-body-sm text-body-sm text-outline">
                            {v.fotoPrincipalUrl
                              ? 'Evidencia fotográfica del preperitaje disponible'
                              : 'Este preperitaje aún no tiene fotos registradas'}
                          </span>
                          {v.estado === 'completado' && (
                            <button
                              onClick={() => openReport(v.id)}
                              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-colors shadow-sm cursor-pointer"
                              type="button"
                            >
                              <span>Ver Informe</span>
                              <span className="material-symbols-outlined text-label-lg">arrow_forward</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Vehicle Card 1: Mazda 3 (Completed) */}
            {(filter === 'all' || filter === 'completed') && (
              <article className="group rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all overflow-hidden border border-outline-variant/30">
                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-4 relative h-48 md:h-auto min-h-[190px]">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt="Dark gray metallic Mazda 3 sedan"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0NLMGMo1RvXc0qF7WSbQKw36pOh-lUbQFpJ4y7oI7S3TVGah4M_ndVZ6jT7Itjm-bHQhbWxRP2jWHKZ9KXgDN_GB0vpJ9r_Q3IJhjJTg3CvBwmz5rXC3u5vvtTJlWUfNJ8vPszAisSOGFV80Z8nRf298FASos_edf-jKkD7G8cXVJogEwlnbXJAhV8fpTcvoxofMP2ER3v6ARMHgclzvwkM66H9vQ8V6MfVhUmKk-eDBRPqiJxgDK"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-on-surface/80 backdrop-blur-md text-on-primary font-label-sm text-label-sm uppercase tracking-wider">
                      Placa JKL-492
                    </div>
                  </div>
                  <div className="md:col-span-8 p-5 md:p-6 flex flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-label-sm font-label-sm text-outline">
                          <span>SECTOR SEDÁN</span>
                          <span>•</span>
                          <span>45.200 km</span>
                          <span>•</span>
                          <span>Modelo 2021</span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Mazda 3 Grand Touring 2021</h3>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-tertiary-fixed/30 text-tertiary font-label-lg text-label-lg">
                          <span className="material-symbols-outlined text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>
                            verified
                          </span>
                          <span className="font-bold">88/100</span>
                        </div>
                        <span className="font-label-sm text-label-sm text-tertiary-container mt-0.5">Muy Buen Estado</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-lg bg-surface-container-low">
                      <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-tertiary-container text-[18px]">check_circle</span>
                        <span>Estructura y chasis íntegros</span>
                      </div>
                      <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-tertiary-container text-[18px]">check_circle</span>
                        <span>Espesor de pintura original</span>
                      </div>
                      <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-outline text-[18px]">info</span>
                        <span>Desgaste de llantas al 35%</span>
                      </div>
                      <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-tertiary-container text-[18px]">check_circle</span>
                        <span>Líneas de ensamble simétricas</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                      <div>
                        <span className="font-label-sm text-label-sm text-outline block">VALOR ESTIMADO MERCADO</span>
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">$68.000.000 - $72.000.000 COP</span>
                      </div>
                      <button
                        onClick={() => onNavigate('informe-detallado')}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-colors shadow-sm cursor-pointer"
                        type="button"
                      >
                        <span>Ver Informe Completo</span>
                        <span className="material-symbols-outlined text-label-lg">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Vehicle Card 2: Renault Duster (With Alert) */}
            {(filter === 'all' || filter === 'alerts') && (
              <article className="group rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all overflow-hidden border border-outline-variant/30">
                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-4 relative h-48 md:h-auto min-h-[190px]">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt="Renault Duster Zen 2019"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYABorskz0eYto-sczgDazC4X5tk3k_rRLJR0FidON_BHMYDGtDpWY6-NWStNqUsAef8KPAuCBARbs_cJ4h3OOa-9zPxwD7FVX8OPE8xIQXIJ4YoAF_lwxrFZWxjtQ8ifYQCXeQJ-tAlmKfnM_a5mgEm27A0fdCjSBV5sYhOowZqFhnrPYg6nrvfomi8N_CF8x9buDmdOfYFcmKFpQQACT7IeuHJ2cVedvAbyQNoIrvuHQ3pTNVIKv"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-error text-on-error font-label-sm text-label-sm uppercase tracking-wider flex items-center gap-1 shadow">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      <span>Placa FGH-103</span>
                    </div>
                  </div>
                  <div className="md:col-span-8 p-5 md:p-6 flex flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-label-sm font-label-sm text-outline">
                          <span>SUV COMPACTO</span>
                          <span>•</span>
                          <span>82.000 km</span>
                          <span>•</span>
                          <span>Modelo 2019</span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Renault Duster Zen 2019</h3>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-error-container text-error font-label-lg text-label-lg">
                          <span className="material-symbols-outlined text-[18px]">notification_important</span>
                          <span className="font-bold">64/100</span>
                        </div>
                        <span className="font-label-sm text-label-sm text-error font-semibold mt-0.5">Alerta Detectada</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-error-container/20 text-on-surface-variant flex flex-col gap-1 border border-error/20">
                      <div className="flex items-center gap-1.5 text-error font-label-md text-label-md font-semibold">
                        <span className="material-symbols-outlined text-[18px]">assignment_late</span>
                        <span>2 observaciones críticas detectadas por visión artificial</span>
                      </div>
                      <ul className="text-body-sm font-body-sm pl-6 list-disc space-y-0.5 text-on-surface-variant">
                        <li><span className="font-semibold text-on-surface">Repintado y masilla:</span> Panel puerta delantera derecha (&gt;220 µm micras estimadas).</li>
                        <li><span className="font-semibold text-on-surface">Sistema de frenos:</span> Surco pronunciado visible en disco de freno delantero.</li>
                      </ul>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                      <div>
                        <span className="font-label-sm text-label-sm text-outline block">VALOR ESTIMADO AJUSTADO</span>
                        <span className="font-headline-sm text-headline-sm text-on-surface font-bold">$46.000.000 - $49.000.000 COP</span>
                      </div>
                      <button
                        onClick={() => onNavigate('admin-auditoria')}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-colors shadow-sm cursor-pointer"
                        type="button"
                      >
                        <span>Ver Informe (Auditoría)</span>
                        <span className="material-symbols-outlined text-label-lg">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Vehicle Card 3: Chevrolet Onix (Completed) */}
            {(filter === 'all' || filter === 'completed') && (
              <article className="group rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-all overflow-hidden border border-outline-variant/30">
                <div className="grid grid-cols-1 md:grid-cols-12">
                  <div className="md:col-span-4 relative h-48 md:h-auto min-h-[190px]">
                    <img
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt="Chevrolet Onix Turbo 2023"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIzldbbrleOzWRojjj0TQ9a7mc1R3sxCtrvpAGVSBtJiI8url7cBkvt6iD27PoxY4MkNlECMcao5WlXbdE8LTIbhjP0n8K2qMoLnmZDyz5XJGclcQ3Jw-7XanRADLXeOOr251nf2qk2verJvG_x7mswn46zyICtkczYh2nbf4517LzRelZpXQI2hiM634fg1JgJNJIoUczMahZK9Fy8ScpxrVBUgm9wkrRK3WIcN8sdD3R1RICU6pB"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-on-surface/80 backdrop-blur-md text-on-primary font-label-sm text-label-sm uppercase tracking-wider">
                      Placa WXY-820
                    </div>
                  </div>
                  <div className="md:col-span-8 p-5 md:p-6 flex flex-col justify-between gap-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-label-sm font-label-sm text-outline">
                          <span>HATCHBACK URBANO</span>
                          <span>•</span>
                          <span>18.500 km</span>
                          <span>•</span>
                          <span>Modelo 2023</span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">Chevrolet Onix Turbo 2023</h3>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-tertiary-fixed text-on-tertiary-fixed font-label-lg text-label-lg">
                          <span className="material-symbols-outlined text-body-md" style={{ fontVariationSettings: "'FILL' 1" }}>
                            stars
                          </span>
                          <span className="font-bold">96/100</span>
                        </div>
                        <span className="font-label-sm text-label-sm text-tertiary font-semibold mt-0.5">Excelente Estado</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 rounded-lg bg-surface-container-low">
                      <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-tertiary-container text-[18px]">check_circle</span>
                        <span>Sin choques estructurales</span>
                      </div>
                      <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-tertiary-container text-[18px]">check_circle</span>
                        <span>Pintura 100% de fábrica</span>
                      </div>
                      <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-tertiary-container text-[18px]">check_circle</span>
                        <span>Llantas con 85% de vida útil</span>
                      </div>
                      <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
                        <span className="material-symbols-outlined text-tertiary-container text-[18px]">check_circle</span>
                        <span>Tapicería e interiores sin desgaste</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1">
                      <div>
                        <span className="font-label-sm text-label-sm text-outline block">VALOR ESTIMADO MERCADO</span>
                        <span className="font-headline-sm text-headline-sm text-primary font-bold">$61.000.000 - $64.000.000 COP</span>
                      </div>
                      <button
                        onClick={() => onNavigate('visor-a4')}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-colors shadow-sm cursor-pointer"
                        type="button"
                      >
                        <span>Ver Certificado A4</span>
                        <span className="material-symbols-outlined text-label-lg">arrow_forward</span>
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            )}
          </section>

          {/* Sidebar Column: Guide, Warnings, and Fast Actions (4 cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-6">
            {/* Quick Guide Card */}
            <div className="p-6 rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-primary text-headline-sm">tips_and_updates</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Guía Rápida para el Usuario</h3>
              </div>
              <ol className="flex flex-col gap-4 relative">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0 font-headline-sm text-body-md font-bold">
                    1
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Datos Básicos del Carro</span>
                    <span className="font-body-sm text-body-sm text-outline mt-0.5">
                      Ingresa placa, marca, línea, año y kilometraje para calibrar la base de datos comparativa.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0 font-headline-sm text-body-md font-bold">
                    2
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Fotos Guiadas por Zonas</span>
                    <span className="font-body-sm text-body-sm text-outline mt-0.5">
                      Captura los 8 ángulos clave (costados, capó, bahía de motor y llantas) usando nuestra retícula.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0 font-headline-sm text-body-md font-bold">
                    3
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Cuestionario de Historial</span>
                    <span className="font-body-sm text-body-sm text-outline mt-0.5">
                      Valida reclamaciones previas de aseguradora, cambios de piezas y récord de mantenimiento.
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center shrink-0 font-headline-sm text-body-md font-bold">
                    4
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Evaluación IA & Rango de Valor</span>
                    <span className="font-body-sm text-body-sm text-outline mt-0.5">
                      Obtén el puntaje de 0 a 100, lista de anomalías y sugerencia de oferta económica en tiempo real.
                    </span>
                  </div>
                </li>
              </ol>
            </div>

            {/* Transparent Legal / Notice Box */}
            <div className="p-4 rounded-xl bg-surface-container-high/60 backdrop-blur-sm text-on-surface flex items-start gap-3 shadow-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-primary text-headline-sm shrink-0 mt-0.5">info</span>
              <div>
                <span className="font-label-md text-label-md text-primary font-bold block mb-1">Aviso Importante</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  AutoCheck es una herramienta de orientación preventiva y asistencia analítica basada en inteligencia artificial visual. No sustituye la inspección física bajo fosa, prueba de compresión de motor ni verificación de chasis en banco de prueba certificado.
                </p>
              </div>
            </div>

            {/* Direct Action Links */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => onNavigate('guia-inspeccion')}
                className="w-full text-left group p-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-sm flex items-center justify-between border border-outline-variant/30 cursor-pointer"
                type="button"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary group-hover:bg-primary-fixed transition-colors">
                    <span className="material-symbols-outlined">photo_camera</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Guía Técnica de Fotografía</span>
                    <span className="font-body-sm text-body-sm text-outline">Trucos de luz y ángulos periciales</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">arrow_forward</span>
              </button>

              <button
                onClick={() => onNavigate('informe-detallado')}
                className="w-full text-left group p-4 rounded-xl bg-surface-container-lowest hover:bg-surface-container-low transition-all shadow-sm flex items-center justify-between border border-outline-variant/30 cursor-pointer"
                type="button"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-secondary group-hover:bg-secondary-fixed transition-colors">
                    <span className="material-symbols-outlined">car_repair</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-lg text-label-lg text-on-surface font-semibold">Centros de Peritaje Autorizados</span>
                    <span className="font-body-sm text-body-sm text-outline">Agenda peritaje oficial con descuento</span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline group-hover:text-secondary transition-colors">arrow_outward</span>
              </button>
            </div>

            {/* System Status Mini Card */}
            <div className="p-4 rounded-xl bg-surface-container-low text-on-surface flex items-center justify-between border border-outline-variant/30">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tertiary-fixed-dim opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-tertiary-container"></span>
                </span>
                <span className="font-label-sm text-label-sm text-outline">API Fasecolda & RUNT: En Línea</span>
              </div>
              <span className="font-label-sm text-label-sm text-primary font-semibold">Latencia 120ms</span>
            </div>
          </aside>
        </div>
      </div>

      {/* Institutional Academic Footer */}
      <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 py-8 mt-12">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-headline-sm">verified_user</span>
            <p className="font-body-sm text-body-sm text-outline max-w-3xl leading-relaxed text-center md:text-left">
              AutoCheck © 2026 — Proyecto IA Generativa UNIMINUTO. Los resultados son exclusivamente orientativos y no sustituyen un peritaje profesional automotriz.
            </p>
          </div>
          <div className="flex items-center gap-4 text-outline font-label-sm text-label-sm">
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">v2.4-beta</span>
            <span className="font-semibold">Auditoría Certificada</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
