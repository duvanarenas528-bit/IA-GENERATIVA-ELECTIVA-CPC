import React, { useState } from 'react';
import { ScreenId } from '../types';
import { AdminLayout } from '../components/AdminLayout';

interface AdminAuditoriaScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AdminAuditoriaScreen: React.FC<AdminAuditoriaScreenProps> = ({ onNavigate }) => {
  // Layer toggles
  const [showBoxes, setShowBoxes] = useState<boolean>(true);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [showEdges, setShowEdges] = useState<boolean>(false);
  const [activePhoto, setActivePhoto] = useState<number>(0);
  const [selectedBox, setSelectedBox] = useState<string | null>('b1');
  const [auditorDecision, setAuditorDecision] = useState<'ratify' | 'escalate' | 'dismiss'>('ratify');
  const [technicalNote, setTechnicalNote] = useState<string>(
    'Se verifica fisura de 4.2 cm en policarbonato de óptica izquierda delantera compatible con impacto leve a baja velocidad. Separación de junta entre capó y guardabarros de 5.8 mm supera tolerancia de fábrica (3.5 mm). Se ratifica observación sin daño estructural mayor en larguero.'
  );
  const [submitted, setSubmitted] = useState<boolean>(false);

  const photos = [
    {
      id: 0,
      title: 'Frontal 3/4 Izquierdo',
      url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80',
      anomalies: 2,
    },
    {
      id: 1,
      title: 'Detalle Óptica & Faro',
      url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      anomalies: 1,
    },
    {
      id: 2,
      title: 'Junta de Capó / Guardabarros',
      url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
      anomalies: 1,
    },
  ];

  const boundingBoxes = [
    {
      id: 'b1',
      title: 'Óptica Delantera Izq: Fisura en Policarbonato',
      score: 89,
      type: 'critical',
      coords: { top: '34%', left: '16%', width: '18%', height: '22%' },
      details: 'Discontinuidad refractiva de 4.2 cm detectada. Riesgo de condensación interna y fallo de haz lumínico.',
    },
    {
      id: 'b2',
      title: 'Parachoques: Descuadre de Fijación',
      score: 76,
      type: 'warning',
      coords: { top: '56%', left: '18%', width: '38%', height: '26%' },
      details: 'Grapa de sujeción lateral descalzada. Holgura asimétrica de 7.1 mm contra 3.2 mm nominal.',
    },
    {
      id: 'b3',
      title: 'Capó: Microrayón y Refracción Anómala',
      score: 68,
      type: 'info',
      coords: { top: '22%', left: '38%', width: '28%', height: '18%' },
      details: 'Pérdida localizada de brillo en laca transparente. Espesor estimado 95 µm.',
    },
  ];

  const handleSignReport = () => {
    setSubmitted(true);
    setTimeout(() => {
      onNavigate('informe-detallado');
    }, 2000);
  };

  return (
    <AdminLayout currentScreen="admin-auditoria" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Banner with Folio & Alert Notice */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-amber-950 text-amber-400 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
                  Revisión Human-in-the-Loop Requerida
                </span>
                <span className="text-xs font-mono text-slate-400">FOLIO: AC-2026-08841-CO</span>
                <span className="text-xs text-slate-500">• Bogotá D.C.</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Auditoría Técnica Pericial • Chevrolet Onix 2022 (NKM-319)
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Confianza predictiva de la IA: <strong className="text-amber-400 font-mono">64.2%</strong> (Por debajo del umbral de auto-aprobación del 80%). Se requiere dictamen de perito certificado.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigate('admin-dashboard')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
              >
                Volver a la Lista
              </button>
              <button
                onClick={() => onNavigate('visor-a4')}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">print</span>
                Ver Documento A4
              </button>
            </div>
          </div>
        </div>

        {/* Main Work Area: Forensic Viewer (8 cols) + Auditor Decision Panel (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Forensic Canvas Viewer */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
              {/* Canvas Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="material-symbols-outlined text-blue-400 text-base">biotech</span>
                  <span className="font-semibold text-slate-200">Visor Forense Multicapa</span>
                  <span className="text-[10px] text-slate-500 font-mono">(Resolución Nativa 4K)</span>
                </div>

                {/* Layer Toggles */}
                <div className="flex items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setShowBoxes(!showBoxes)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 border ${
                      showBoxes
                        ? 'bg-blue-600/30 text-blue-300 border-blue-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">crop_square</span>
                    Bounding Boxes
                  </button>

                  <button
                    onClick={() => setShowHeatmap(!showHeatmap)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 border ${
                      showHeatmap
                        ? 'bg-rose-600/30 text-rose-300 border-rose-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">gradient</span>
                    Mapa de Calor µm
                  </button>

                  <button
                    onClick={() => setShowEdges(!showEdges)}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition flex items-center gap-1 border ${
                      showEdges
                        ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">filter_b_and_w</span>
                    Filtro Bordes Sobel
                  </button>
                </div>
              </div>

              {/* Main Interactive Canvas Area */}
              <div className="relative aspect-[16/10] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center select-none">
                <img
                  src={photos[activePhoto].url}
                  alt="Forensic View"
                  className={`w-full h-full object-cover transition duration-300 ${
                    showEdges ? 'filter contrast-200 invert' : ''
                  }`}
                />

                {/* Heatmap Overlay Simulation */}
                {showHeatmap && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/30 via-amber-500/20 to-blue-500/30 mix-blend-color-dodge pointer-events-none">
                    <div className="absolute bottom-3 left-3 bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-white border border-slate-700">
                      Escala de Espesor: [Azul: 90µm] [Amarillo: 180µm] [Rojo: &gt;320µm]
                    </div>
                  </div>
                )}

                {/* Bounding Boxes Overlays */}
                {showBoxes &&
                  boundingBoxes.map((box) => (
                    <div
                      key={box.id}
                      onClick={() => setSelectedBox(box.id)}
                      style={{
                        top: box.coords.top,
                        left: box.coords.left,
                        width: box.coords.width,
                        height: box.coords.height,
                      }}
                      className={`absolute cursor-pointer border-2 transition-all duration-200 ${
                        selectedBox === box.id
                          ? 'border-emerald-400 bg-emerald-400/20 shadow-lg shadow-emerald-500/40'
                          : box.type === 'critical'
                          ? 'border-rose-500 bg-rose-500/15 hover:bg-rose-500/25'
                          : 'border-amber-400 bg-amber-400/15 hover:bg-amber-400/25'
                      }`}
                    >
                      <div className="absolute -top-6 left-0 bg-slate-950/90 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-slate-700 whitespace-nowrap flex items-center gap-1 shadow">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            box.type === 'critical' ? 'bg-rose-400' : 'bg-amber-400'
                          }`}
                        />
                        {box.title.split(':')[0]} ({box.score}%)
                      </div>
                    </div>
                  ))}

                {/* Canvas Status Watermark */}
                <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur border border-slate-700 px-2 py-1 rounded text-[9px] font-mono text-slate-300">
                  CANVAS: HITL-AUDIT-ACTIVE
                </div>
              </div>

              {/* Photo Strip Switcher */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {photos.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActivePhoto(p.id)}
                    className={`p-1.5 rounded-lg border text-left transition flex items-center gap-2 ${
                      activePhoto === p.id
                        ? 'border-blue-500 bg-blue-950/40 text-white'
                        : 'border-slate-800 bg-slate-950/60 text-slate-400 hover:text-white'
                    }`}
                  >
                    <img src={p.url} alt={p.title} className="w-10 h-8 object-cover rounded" />
                    <div className="min-w-0">
                      <span className="text-[11px] font-semibold block truncate">{p.title}</span>
                      <span className="text-[9px] text-amber-400 font-mono">
                        {p.anomalies} anomalías
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Anomaly Deep-Dive Card */}
            {selectedBox && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <strong className="text-white text-sm">
                      {boundingBoxes.find((b) => b.id === selectedBox)?.title}
                    </strong>
                  </div>
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono">
                    Confianza: {boundingBoxes.find((b) => b.id === selectedBox)?.score}%
                  </span>
                </div>
                <p className="text-slate-300 mt-2 leading-relaxed">
                  {boundingBoxes.find((b) => b.id === selectedBox)?.details}
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Auditor Decision & Signing Form */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-400 text-base">gavel</span>
                  Resolución Pericial HITL
                </h3>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  Perito Autorizado
                </span>
              </div>

              {/* Decision Options */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Dictamen del Auditor
                </label>

                <div
                  onClick={() => setAuditorDecision('ratify')}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                    auditorDecision === 'ratify'
                      ? 'bg-amber-950/40 border-amber-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    checked={auditorDecision === 'ratify'}
                    onChange={() => setAuditorDecision('ratify')}
                    className="mt-0.5 text-amber-500"
                  />
                  <div>
                    <strong className="block text-xs text-white">Ratificar con Observación</strong>
                    <span className="text-[11px] text-slate-400">
                      Aprobar reporte penalizando puntaje a 64 pts (Sin daño estructural severo).
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setAuditorDecision('escalate')}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                    auditorDecision === 'escalate'
                      ? 'bg-rose-950/40 border-rose-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    checked={auditorDecision === 'escalate'}
                    onChange={() => setAuditorDecision('escalate')}
                    className="mt-0.5 text-rose-500"
                  />
                  <div>
                    <strong className="block text-xs text-white">Rechazar por Daño Estructural</strong>
                    <span className="text-[11px] text-slate-400">
                      Declarar vehículo NO APTO para compraventa o crédito prendario.
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setAuditorDecision('dismiss')}
                  className={`p-3 rounded-xl border cursor-pointer transition flex items-start gap-3 ${
                    auditorDecision === 'dismiss'
                      ? 'bg-emerald-950/40 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <input
                    type="radio"
                    checked={auditorDecision === 'dismiss'}
                    onChange={() => setAuditorDecision('dismiss')}
                    className="mt-0.5 text-emerald-500"
                  />
                  <div>
                    <strong className="block text-xs text-white">Descartar Falso Positivo</strong>
                    <span className="text-[11px] text-slate-400">
                      Defecto corresponde a reflejo solar de la fotografía; elevar puntaje a 85 pts.
                    </span>
                  </div>
                </div>
              </div>

              {/* Technical Note */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Nota Técnica Obligatoria
                </label>
                <textarea
                  rows={4}
                  value={technicalNote}
                  onChange={(e) => setTechnicalNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-sans"
                />
              </div>

              {/* Digital Signature Confirmation */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Responsables Periciales:</span>
                  <span className="font-bold text-white">Ing. Duban Tibaquira & Ing. Leni Murillo</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Profesión:</span>
                  <span className="text-emerald-400 font-semibold">Profesionales en Ing. de Sistemas</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>Sello Forense:</span>
                  <span>SHA256: 7f81...a34e</span>
                </div>
              </div>

              {/* Submit Button */}
              {submitted ? (
                <div className="p-3 bg-emerald-950 border border-emerald-700 text-emerald-300 rounded-xl text-center text-xs font-bold animate-pulse">
                  ✓ Dictamen emitido y sellado criptográficamente. Redirigiendo...
                </div>
              ) : (
                <button
                  onClick={handleSignReport}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-base">draw</span>
                  Firmar y Emitir Dictamen Oficial
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
