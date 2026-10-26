import React, { useState } from 'react';
import { ScreenId } from '../types';
import { AdminLayout } from '../components/AdminLayout';

interface AdminDashboardScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AdminDashboardScreen: React.FC<AdminDashboardScreenProps> = ({ onNavigate }) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'flagged'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const recentInspections = [
    {
      id: 'AC-2026-08842',
      vehicle: 'Renault Duster 2021',
      plate: 'HKS-482',
      score: 88,
      status: 'approved',
      statusLabel: 'Auto-Aprobado',
      hitlReviewer: 'Duban Tibaquira (Ing. Sistemas)',
      latency: '1.14s',
      anomalies: 1,
      date: 'Hace 8 min',
      riskLevel: 'low',
    },
    {
      id: 'AC-2026-08841',
      vehicle: 'Chevrolet Onix 2022',
      plate: 'NKM-319',
      score: 64,
      status: 'pending',
      statusLabel: 'Pendiente Auditoría',
      hitlReviewer: 'Sin Asignar',
      latency: '1.42s',
      anomalies: 3,
      date: 'Hace 24 min',
      riskLevel: 'high',
    },
    {
      id: 'AC-2026-08840',
      vehicle: 'Mazda CX-30 2023',
      plate: 'WXY-820',
      score: 95,
      status: 'approved',
      statusLabel: 'Auto-Aprobado',
      hitlReviewer: 'Automático',
      latency: '0.98s',
      anomalies: 0,
      date: 'Hace 45 min',
      riskLevel: 'low',
    },
    {
      id: 'AC-2026-08839',
      vehicle: 'Toyota Hilux 2020',
      plate: 'TRK-901',
      score: 72,
      status: 'flagged',
      statusLabel: 'Repintado Detectado',
      hitlReviewer: 'Leni Murillo (Ing. Sistemas)',
      latency: '1.30s',
      anomalies: 2,
      date: 'Hace 1 hora',
      riskLevel: 'medium',
    },
    {
      id: 'AC-2026-08838',
      vehicle: 'Volkswagen Gol 2019',
      plate: 'KLU-402',
      score: 58,
      status: 'pending',
      statusLabel: 'Pendiente Auditoría',
      hitlReviewer: 'Sin Asignar',
      latency: '1.25s',
      anomalies: 4,
      date: 'Hace 2 horas',
      riskLevel: 'high',
    },
  ];

  const filteredInspections = recentInspections.filter((item) => {
    if (filterStatus !== 'all' && item.status !== filterStatus) return false;
    if (searchQuery && !item.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) && !item.plate.toLowerCase().includes(searchQuery.toLowerCase()) && !item.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <AdminLayout currentScreen="admin-dashboard" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Page Top Title & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800 tracking-wider uppercase">
                Centro de Mando Telemático
              </span>
              <span className="text-xs text-slate-400">UNIMINUTO AI Lab • Nodo Bogotá</span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1 tracking-tight">
              Panel de Supervisión y Operaciones IA
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin-auditoria')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition flex items-center gap-2 shadow-lg shadow-amber-600/20"
            >
              <span className="material-symbols-outlined text-base">fact_check</span>
              Revisar Cola HITL (2)
            </button>
            <button
              onClick={() => onNavigate('admin-metricas')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 transition flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-base text-indigo-400">query_stats</span>
              Ver Métricas & Benchmarks
            </button>
          </div>
        </div>

        {/* 4 Primary Operational KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Inspecciones Hoy</span>
              <span className="material-symbols-outlined text-blue-400 text-xl">directions_car</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">48</span>
              <span className="text-xs font-bold text-emerald-400">+14% vs ayer</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              34 aprobadas • 12 observadas • 2 rechazadas
            </div>
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-xl pointer-events-none"></div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Precisión del Modelo</span>
              <span className="material-symbols-outlined text-emerald-400 text-xl">verified</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">98.4%</span>
              <span className="text-xs font-semibold text-slate-400">IoU 0.91</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Concordancia pericial certificada NTC-5375
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Tiempo de Inferencia</span>
              <span className="material-symbols-outlined text-indigo-400 text-xl">speed</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-indigo-400">1.18s</span>
              <span className="text-xs font-semibold text-slate-400">p95: 1.84s</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Gemini Vision Multimodal API v2.5
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Cola HITL Pendiente</span>
              <span className="material-symbols-outlined text-amber-400 text-xl">pending_actions</span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400">2</span>
              <span className="text-xs font-bold text-amber-300">Requiere Perito</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-500">
              Puntajes limítrofes (&lt; 70 pts)
            </div>
          </div>
        </div>

        {/* Main Grid: Live Inspections Table + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Inspection Table (8 cols) */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Flujo de Inspecciones en Vivo
                </h3>
                <span className="text-xs text-slate-400">Monitoreo continuo de telemetría y diagnósticos</span>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Buscar placa, folio o modelo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-48"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendientes HITL</option>
                  <option value="approved">Aprobados</option>
                  <option value="flagged">Observados</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-3">Folio / Placa</th>
                    <th className="py-3 px-3">Vehículo</th>
                    <th className="py-3 px-2 text-center">Score IA</th>
                    <th className="py-3 px-3">Estado</th>
                    <th className="py-3 px-2 text-center">Latencia</th>
                    <th className="py-3 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredInspections.map((row) => (
                    <tr key={row.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3">
                        <span className="font-mono font-bold text-white block">{row.plate}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{row.id}</span>
                      </td>
                      <td className="py-3 px-3">
                        <strong className="text-white block">{row.vehicle}</strong>
                        <span className="text-[10px] text-slate-400">{row.date}</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span
                          className={`inline-block font-black px-2 py-0.5 rounded text-xs ${
                            row.score >= 80
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : row.score >= 65
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-rose-950 text-rose-400 border border-rose-800'
                          }`}
                        >
                          {row.score} pts
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              row.status === 'approved'
                                ? 'bg-emerald-400'
                                : row.status === 'pending'
                                ? 'bg-amber-400 animate-ping'
                                : 'bg-rose-400'
                            }`}
                          />
                          <span
                            className={`text-[11px] font-semibold ${
                              row.status === 'approved'
                                ? 'text-emerald-300'
                                : row.status === 'pending'
                                ? 'text-amber-300'
                                : 'text-rose-300'
                            }`}
                          >
                            {row.statusLabel}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block">{row.anomalies} anomalías detectadas</span>
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-slate-400">
                        {row.latency}
                      </td>
                      <td className="py-3 px-3 text-right">
                        {row.status === 'pending' ? (
                          <button
                            onClick={() => onNavigate('admin-auditoria')}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded transition"
                          >
                            Auditar HITL
                          </button>
                        ) : (
                          <button
                            onClick={() => onNavigate('informe-detallado')}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] rounded transition border border-slate-700"
                          >
                            Ver Reporte
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: AI Health & Active Anomalies (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* System Status Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                <span>Estado de Infraestructura IA</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </h3>

              <div className="space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>Gemini Vision API Quota</span>
                    <span className="font-mono text-white">42.8% (214/500 RPM)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '42.8%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>GPU Tensor Memory</span>
                    <span className="font-mono text-white">61% (14.6 GB / 24 GB)</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5">
                    <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '61%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[11px] mb-1">
                    <span>Disponibilidad Nodal (Uptime)</span>
                    <span className="font-mono text-emerald-400">99.98%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '99.98%' }}></div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] text-slate-400">
                <span>Versión Motor: <strong className="text-slate-200">AutoCheck-v2.6-Core</strong></span>
                <span className="text-emerald-400 font-mono">TLS 1.3 Seguro</span>
              </div>
            </div>

            {/* Live Anomalies Alert Feed */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-400 text-sm">warning</span>
                Alertas Telemáticas Activas
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-slate-300">
                  <div className="flex items-center justify-between">
                    <strong className="text-amber-300 text-[11px]">Discrepancia en Odómetro</strong>
                    <span className="text-[10px] text-slate-500">Hace 18m</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Vehículo <strong>NKM-319</strong> presenta odómetro analógico con marcas de remoción de aguja.
                  </p>
                </div>

                <div className="p-2.5 rounded-lg bg-rose-950/30 border border-rose-800/40 text-slate-300">
                  <div className="flex items-center justify-between">
                    <strong className="text-rose-300 text-[11px]">Repintado no Homologado</strong>
                    <span className="text-[10px] text-slate-500">Hace 1h</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Lectura estimada de espesor &gt; 320 µm en panel trasero izquierdo de Hilux TRK-901.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
