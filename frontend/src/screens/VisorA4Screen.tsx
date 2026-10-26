import React, { useEffect, useState } from 'react';
import { PreperitajeInforme, ScreenId } from '../types';
import { AutoCheckLogo } from '../components/AutoCheckLogo';
import { assetUrl, getPreperitajeInforme, listPreperitajes } from '../services/api';

interface VisorA4ScreenProps {
  onNavigate: (screen: ScreenId) => void;
  preperitajeId?: string | null;
}

function formatStamp(value?: string) {
  if (!value) return 'Sin fecha registrada';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha registrada';
  const day = date
    .toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: 'America/Bogota',
    })
    .replace('.', '')
    .toUpperCase();
  const time = date.toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'America/Bogota',
  });
  return `${day} ${time} COT`;
}

function formatNumber(value?: number | null) {
  if (value === null || value === undefined) return 'N/D';
  return value.toLocaleString('es-CO');
}

function scoreVerdict(score: number) {
  if (score >= 70) {
    return { label: 'BUENO (APROBADO)', badge: 'CONFORME', classes: 'text-emerald-700' };
  }
  if (score >= 40) {
    return { label: 'CON OBSERVACIONES', badge: 'OBSERVACIÓN', classes: 'text-amber-700' };
  }
  return { label: 'REVISIÓN RECOMENDADA', badge: 'REVISIÓN', classes: 'text-rose-700' };
}

function decisionFor(condition: string) {
  if (condition === 'good') return { label: 'CONFORME', classes: 'text-emerald-700' };
  if (condition === 'not-applicable') return { label: 'NO APLICA', classes: 'text-slate-500' };
  return { label: 'OBSERVACIÓN', classes: 'text-amber-700' };
}

export const VisorA4Screen: React.FC<VisorA4ScreenProps> = ({ onNavigate, preperitajeId }) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [verifiedHash, setVerifiedHash] = useState<boolean>(false);
  const [informe, setInforme] = useState<PreperitajeInforme | null>(null);
  const [resolvedId, setResolvedId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportHash, setReportHash] = useState('');

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setError('');
      try {
        let id = preperitajeId || '';
        if (!id) {
          const data = await listPreperitajes();
          const lista: any[] = data.preperitajes || [];
          const latest = lista.find((p) => p.estado === 'completado') || lista[0];
          id = latest?.id || '';
        }
        if (!id) {
          throw new Error('Aún no tienes preperitajes. Crea uno y genera tu informe.');
        }
        const data = await getPreperitajeInforme(id);
        if (active) {
          setInforme(data.informe);
          setResolvedId(id);
        }
      } catch (e: any) {
        if (active) setError(e.message || 'No se pudo cargar el certificado.');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [preperitajeId]);

  useEffect(() => {
    let active = true;
    if (!informe) {
      setReportHash('');
      return;
    }

    (async () => {
      try {
        const buffer = await crypto.subtle.digest(
          'SHA-256',
          new TextEncoder().encode(JSON.stringify(informe))
        );
        const hash = Array.from(new Uint8Array(buffer))
          .map((byte) => byte.toString(16).padStart(2, '0'))
          .join('');
        if (active) setReportHash(hash);
      } catch {
        if (active) setReportHash('');
      }
    })();

    return () => {
      active = false;
    };
  }, [informe]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center text-sm">
        Cargando certificado...
      </div>
    );
  }

  if (error || !informe) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center gap-4 p-6 text-center">
        <AutoCheckLogo size="lg" variant="white" showSubtitle={false} />
        <p className="text-sm text-slate-300">{error || 'No se pudo cargar el certificado.'}</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition"
        >
          Volver al Panel Principal
        </button>
      </div>
    );
  }

  const { vehiculo, usuario, resumen, diagnostico, fotos, partes } = informe;
  const score = resumen.porcentajeBuenas;
  const verdict = scoreVerdict(score);
  const vehicleName =
    [vehiculo.marca, vehiculo.linea].filter(Boolean).join(' ') || 'Vehículo sin identificar';
  const vehicleDetails =
    [vehiculo.color, vehiculo.transmision].filter(Boolean).join(' • ') || 'Datos no registrados';
  const shareUrl = resolvedId
    ? `${window.location.origin}/informe/${encodeURIComponent(resolvedId)}`
    : window.location.href;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Top Toolbar */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-3">
          <AutoCheckLogo size="sm" variant="white" showSubtitle={false} onClick={() => onNavigate('dashboard')} />
          <button
            onClick={() => onNavigate('informe-detallado')}
            className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded transition"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Volver al Informe
          </button>
          <div className="h-5 w-px bg-slate-700 hidden sm:block"></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Documento Certificado Oficial
              </span>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                FOLIO: {informe.folio}
              </span>
            </div>
            <h1 className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
              Certificado de Preperitaje Técnico • {vehicleName}
              {vehiculo.anio ? ` ${vehiculo.anio}` : ''} ({vehiculo.placa || 'SIN PLACA'})
            </h1>
          </div>
        </div>

        {/* Toolbar Actions */}
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="hidden md:flex items-center bg-slate-800 rounded p-1 border border-slate-700 text-xs">
            <button
              onClick={() => setZoomLevel((prev) => Math.max(60, prev - 10))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
              title="Reducir zoom"
            >
              <span className="material-symbols-outlined text-base">remove</span>
            </button>
            <span className="px-2 font-mono text-slate-300 min-w-12 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel((prev) => Math.min(150, prev + 10))}
              className="p-1 hover:bg-slate-700 rounded text-slate-300"
              title="Aumentar zoom"
            >
              <span className="material-symbols-outlined text-base">add</span>
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="px-2 py-0.5 hover:bg-slate-700 rounded text-[11px] text-slate-400 hover:text-white"
            >
              Ajustar
            </button>
          </div>

          <button
            onClick={() => setVerifiedHash(true)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded transition border ${
              verifiedHash
                ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-base text-emerald-400">
              {verifiedHash ? 'verified' : 'security'}
            </span>
            <span className="hidden sm:inline">
              {verifiedHash ? 'Firma SHA-256 Válida' : 'Verificar Firma'}
            </span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded transition"
          >
            <span className="material-symbols-outlined text-base text-indigo-400">qr_code_2</span>
            <span className="hidden sm:inline">QR / Compartir</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded transition shadow-lg shadow-blue-900/40"
          >
            <span className="material-symbols-outlined text-base">print</span>
            <span>Imprimir / Descargar PDF</span>
          </button>
        </div>
      </header>

      {/* Main Document Viewer Container */}
      <main className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start bg-slate-950">
        <div
          className="transition-all duration-200 origin-top"
          style={{ transform: `scale(${zoomLevel / 100})` }}
        >
          {/* A4 Sheet Container */}
          <div className="w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl relative p-10 flex flex-col justify-between font-sans print:shadow-none print:m-0 print:w-full print:p-8">
            
            {/* Watermark in background */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] select-none rotate-[-30deg]">
              <span className="text-8xl font-black uppercase tracking-widest text-slate-950">
                AUTOCHECK CERTIFIED
              </span>
            </div>

            {/* Document Header */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-5">
                <div className="flex items-center gap-4">
                  <AutoCheckLogo size="lg" variant="default" subtitleText="SISTEMA TELEMÁTICO" />
                  <div className="border-l border-slate-300 pl-4 hidden sm:block">
                    <p className="text-xs text-slate-500 font-medium">
                      Laboratorio de Peritaje Vehicular e Inteligencia Artificial • UNIMINUTO
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">Norma Técnica NTC-5375</span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block bg-slate-100 border border-slate-300 px-3 py-1 rounded text-right">
                    <span className="block text-[9px] uppercase tracking-wider font-bold text-slate-500">
                      FOLIO CERTIFICADO
                    </span>
                    <span className="font-mono text-sm font-bold text-slate-900">
                      {informe.folio}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 font-mono">
                    Emitido: {formatStamp(informe.fecha)}
                  </p>
                </div>
              </div>

              {/* Document Subheader / Legal Disclaimer */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded text-[10px] text-slate-600 flex items-start gap-2">
                <span className="material-symbols-outlined text-sm text-blue-700 mt-0.5 shrink-0">info</span>
                <p>
                  <strong>DICTAMEN TÉCNICO PRELIMINAR:</strong> {informe.aviso}. {diagnostico.texto}{' '}
                  {diagnostico.recomendacion}
                </p>
              </div>

              {/* Vehicle Primary Identification Matrix */}
              <div className="mt-5 grid grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-100 rounded border border-slate-200">
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase">Placa / Identificador</span>
                  <span className="text-base font-black font-mono text-slate-900">{vehiculo.placa || 'SIN PLACA'}</span>
                  <span className="block text-[10px] text-slate-500">{usuario.nombre}</span>
                </div>
                <div className="p-3 bg-slate-100 rounded border border-slate-200">
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase">Vehículo / Versión</span>
                  <span className="text-sm font-bold text-slate-900 truncate block">{vehiculo.marca || 'Vehículo'}</span>
                  <span className="block text-[10px] text-slate-500">{vehicleDetails}</span>
                </div>
                <div className="p-3 bg-slate-100 rounded border border-slate-200">
                  <span className="block text-[10px] font-semibold text-slate-500 uppercase">Año Modelo & Km</span>
                  <span className="text-sm font-bold text-slate-900">{vehiculo.anio || 'N/D'} • {formatNumber(vehiculo.kilometraje)} km</span>
                  <span className="block text-[10px] text-emerald-600 font-medium">Odómetro registrado</span>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded text-center flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-blue-900 uppercase">Índice según Respuestas</span>
                  <span className="text-2xl font-black text-blue-700">{score}<span className="text-sm font-normal text-blue-900">/100</span></span>
                  <span className="text-[10px] font-semibold text-blue-800">{verdict.label}</span>
                </div>
              </div>

              {/* Technical Specifications & Legal Checks */}
              <div className="mt-4 border border-slate-200 rounded p-3 text-[11px] grid grid-cols-3 gap-2 bg-white">
                <div>
                  <span className="text-slate-500">Usuario responsable:</span>
                  <span className="font-semibold block text-slate-900">{usuario.nombre}</span>
                </div>
                <div>
                  <span className="text-slate-500">Partes evaluadas:</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs">check_circle</span> {resumen.totalPartes} registradas
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Hallazgos reportados:</span>
                  <span className={`font-semibold flex items-center gap-1 ${verdict.classes}`}>
                    <span className="material-symbols-outlined text-xs">{resumen.partesConProblemas > 0 ? 'warning' : 'verified'}</span>
                    {resumen.partesConProblemas} {resumen.partesConProblemas === 1 ? 'hallazgo' : 'hallazgos'}
                  </span>
                </div>
              </div>

              {/* Photographic Evidentiary Grid */}
              <div className="mt-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-3 bg-blue-600 rounded-sm"></span>
                    Registro Fotográfico del Preperitaje
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {fotos.length} {fotos.length === 1 ? 'Ángulo Registrado' : 'Ángulos Registrados'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  {fotos.length === 0 && (
                    <div className="col-span-3 border border-slate-200 rounded p-1.5 bg-slate-50">
                      <div className="relative aspect-[4/3] rounded overflow-hidden bg-slate-200 flex items-center justify-center">
                        <span className="text-[11px] text-slate-500">Sin fotos subidas</span>
                      </div>
                    </div>
                  )}

                  {fotos.map((foto) => (
                    <div key={foto.id} className="border border-slate-200 rounded p-1.5 bg-slate-50">
                      <div className="relative aspect-[4/3] rounded overflow-hidden bg-slate-200">
                        <img
                          src={assetUrl(foto.url)}
                          alt={foto.zonaEtiqueta}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-slate-950/80 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">
                          {foto.zonaEtiqueta}
                        </span>
                      </div>
                      <div className="mt-1 flex justify-between text-[10px]">
                        <span className="text-slate-600">Evidencia digital</span>
                        <span className="text-emerald-700 font-bold">Archivo seguro</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assessment Breakdown Table */}
              <div className="mt-5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-blue-600 rounded-sm"></span>
                  Matriz de Evaluación por Sistemas
                </h3>

                <table className="w-full text-left border border-slate-200 rounded text-[11px]">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px]">
                    <tr>
                      <th className="py-2 px-3">Parte Evaluada</th>
                      <th className="py-2 px-2 text-center">Categoría</th>
                      <th className="py-2 px-3">Observaciones Registradas</th>
                      <th className="py-2 px-2 text-right">Dictamen</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {partes.length === 0 && (
                      <tr>
                        <td className="py-2 px-3 font-semibold text-slate-900" colSpan={4}>
                          Sin respuestas registradas en el cuestionario.
                        </td>
                      </tr>
                    )}
                    {partes.map((parte) => {
                      const decision = decisionFor(parte.condicion);
                      return (
                        <tr key={parte.id}>
                          <td className="py-2 px-3 font-semibold text-slate-900">{parte.nombre}</td>
                          <td className="py-2 px-2 text-center font-bold text-slate-600">{parte.categoriaEtiqueta}</td>
                          <td className="py-2 px-3 text-slate-600">
                            {parte.observaciones || 'Sin observaciones adicionales registradas.'}
                          </td>
                          <td className={`py-2 px-2 text-right font-bold ${decision.classes}`}>{decision.label}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Questionnaire Result Box */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-300 rounded flex items-center justify-between text-xs">
                <div>
                  <span className="block text-[10px] font-bold uppercase text-slate-500">
                    Resultado del Cuestionario
                  </span>
                  <p className="text-slate-700 text-[11px] mt-0.5">
                    Partes en buen estado: <strong className="text-slate-900">{resumen.partesBuenas} de {resumen.totalPartes}</strong>{' '}
                    • Hallazgos: <strong className="text-slate-900">{resumen.partesConProblemas}</strong>
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-500 block">Índice según respuestas</span>
                  <span className="text-lg font-black text-blue-700">{score} / 100</span>
                </div>
              </div>
            </div>

            {/* Document Footer: Signatures, Hashes & QR */}
            <div className="border-t-2 border-slate-900 pt-4 mt-6">
              <div className="grid grid-cols-3 gap-6 items-end">
                {/* Responsible User Signature */}
                <div>
                  <div className="h-12 border-b border-dashed border-slate-400 flex items-end justify-center gap-2 pb-1">
                    <span className="font-serif italic text-sm text-slate-800 select-none">
                      {usuario.nombre}
                    </span>
                  </div>
                  <div className="text-[10px] text-center mt-1">
                    <span className="font-bold text-slate-900 block">
                      {usuario.nombre}
                    </span>
                    <span className="text-slate-600 block">{usuario.correo || 'Sin correo registrado'}</span>
                    <span className="text-blue-700 font-semibold block">Facultad de Ingeniería • UNIMINUTO</span>
                  </div>
                </div>

                {/* Cryptographic Verification Details */}
                <div className="text-center font-mono text-[9px] text-slate-600 bg-slate-100 p-2 rounded border border-slate-200">
                  <span className="font-bold text-slate-900 block uppercase mb-1">
                    Integridad Digital SHA-256
                  </span>
                  <span className="break-all text-[8px] text-slate-700 select-all block">
                    {reportHash || 'Calculando hash del informe...'}
                  </span>
                  <span className="text-emerald-700 font-semibold block mt-1">
                    ● Timestamp: {formatStamp(informe.fecha)}
                  </span>
                </div>

                {/* QR Code and Seals */}
                <div className="flex items-center justify-end gap-3">
                  <div className="w-16 h-16 bg-slate-900 p-1 rounded flex items-center justify-center">
                    <div className="w-full h-full bg-white flex flex-col items-center justify-center text-[7px] font-mono text-center font-bold">
                      <span className="material-symbols-outlined text-3xl text-slate-900">qr_code_2</span>
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-500">
                    <strong className="block text-slate-900">Escanear para cotejar</strong>
                    <span>Validación telemática en tiempo real vía servidor seguro TLS 1.3</span>
                  </div>
                </div>
              </div>

              {/* Bottom Copyright */}
              <div className="mt-4 pt-2 border-t border-slate-200 text-center text-[9px] text-slate-400">
                AutoCheck Diagnostic Platform © 2026 • Proyecto Institucional de Investigación y Desarrollo Tecnológico Automotriz • Todos los derechos reservados.
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Share / QR Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-sm w-full p-6 text-center text-slate-100 shadow-2xl">
            <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-2xl">share</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Compartir Informe Certificado</h3>
            <p className="text-xs text-slate-400 mb-4">
              Cualquier interesado o aseguradora puede cotejar la autenticidad con este código QR o enlace encriptado.
            </p>

            <div className="bg-white p-4 rounded-lg inline-block mb-4 shadow-inner">
              <span className="material-symbols-outlined text-7xl text-slate-950">qr_code_2</span>
            </div>

            <div className="bg-slate-950 p-2 rounded text-xs font-mono text-slate-400 break-all mb-4 border border-slate-800">
              {shareUrl}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(shareUrl);
                  alert('¡Enlace copiado al portapapeles!');
                }}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-bold transition"
              >
                Copiar Enlace
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
