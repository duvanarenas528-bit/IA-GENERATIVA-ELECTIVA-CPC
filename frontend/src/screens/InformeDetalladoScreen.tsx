import React, { useEffect, useState } from 'react';
import { PreperitajeInforme, PreperitajeParteInforme, ScreenId } from '../types';
import { assetUrl, getPreperitajeInforme, listPreperitajes } from '../services/api';

interface InformeDetalladoScreenProps {
  onNavigate: (screen: ScreenId) => void;
  preperitajeId?: string | null;
}

type ComponentFilter = 'all' | 'carroceria' | 'optica' | 'frenos' | 'interior';

const FILTER_LABELS: { id: ComponentFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'carroceria', label: 'Carrocería & Pintura' },
  { id: 'optica', label: 'Óptica & Cristales' },
  { id: 'frenos', label: 'Llantas & Frenos' },
  { id: 'interior', label: 'Interior & Cabina' },
];

function formatDate(value?: string) {
  if (!value) return 'Sin fecha registrada';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Sin fecha registrada';
  return date.toLocaleString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatNumber(value?: number | null) {
  if (value === null || value === undefined) return 'N/D';
  return value.toLocaleString('es-CO');
}

function filterForPart(part: PreperitajeParteInforme): ComponentFilter {
  if (part.categoria === 'interior') return 'interior';
  if (part.categoria === 'mecanica' || part.categoria === 'tren_rodante') return 'frenos';
  const name = part.nombre.toLowerCase();
  if (
    name.includes('techo') ||
    name.includes('cristal') ||
    name.includes('vidrio') ||
    name.includes('parabrisas') ||
    name.includes('faro') ||
    name.includes('óptic')
  ) {
    return 'optica';
  }
  return 'carroceria';
}

function iconForPart(part: PreperitajeParteInforme) {
  if (part.categoria === 'interior') return 'airline_seat_recline_normal';
  if (part.categoria === 'mecanica') return 'settings';
  if (part.categoria === 'tren_rodante') return 'tire_repair';
  if (filterForPart(part) === 'optica') return 'highlight';
  if (part.condicion === 'repainted') return 'format_paint';
  return 'directions_car';
}

function statusBadge(part: PreperitajeParteInforme) {
  if (part.condicion === 'good') {
    return {
      label: 'Óptimo',
      dot: 'bg-tertiary',
      classes: 'bg-tertiary-fixed text-on-tertiary-fixed',
    };
  }
  if (part.condicion === 'not-applicable') {
    return {
      label: 'No aplica',
      dot: 'bg-outline',
      classes: 'bg-surface-container-high text-on-surface-variant',
    };
  }
  if (part.condicion === 'dents' || part.condicion === 'broken') {
    return {
      label: part.condicionEtiqueta,
      dot: 'bg-error',
      classes: 'bg-error-container text-error',
    };
  }
  return {
    label: part.condicionEtiqueta,
    dot: 'bg-secondary',
    classes: 'bg-secondary-fixed text-on-secondary-fixed',
  };
}

export const InformeDetalladoScreen: React.FC<InformeDetalladoScreenProps> = ({
  onNavigate,
  preperitajeId,
}) => {
  const [componentFilter, setComponentFilter] = useState<ComponentFilter>('all');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [informe, setInforme] = useState<PreperitajeInforme | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
          if (active) setError('Aún no tienes informes. Crea un preperitaje y genera tu informe.');
          return;
        }
        const data = await getPreperitajeInforme(id);
        if (active) setInforme(data.informe);
      } catch (e: any) {
        if (active) setError(e.message || 'No se pudo cargar el informe.');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [preperitajeId]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      window.print();
    }, 1200);
  };

  if (loading) {
    return (
      <div className="w-full pt-20 bg-surface min-h-[calc(100vh-140px)]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center font-body-md text-body-md text-on-surface-variant">
          Cargando informe...
        </div>
      </div>
    );
  }

  if (error || !informe) {
    return (
      <div className="w-full pt-20 bg-surface min-h-[calc(100vh-140px)]">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-md border border-outline-variant/30 text-center flex flex-col items-center gap-4">
            <span className="material-symbols-outlined text-headline-lg text-outline">description</span>
            <p className="font-body-md text-body-md text-on-surface-variant">{error || 'No se pudo cargar el informe.'}</p>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-all shadow-md cursor-pointer"
              type="button"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { resumen, vehiculo, usuario, diagnostico, fotos } = informe;
  const porcentaje = resumen.porcentajeBuenas;
  const gaugeOffset = 364.4 * (1 - porcentaje / 100);
  const noAplicables = informe.partes.filter((p) => p.condicion === 'not-applicable').length;
  const partesFiltradas =
    componentFilter === 'all'
      ? informe.partes
      : informe.partes.filter((p) => filterForPart(p) === componentFilter);

  const pct = (value: number) => {
    if (!resumen.totalPartes) return 0;
    return Math.max(0, Math.min(100, Math.round((value / resumen.totalPartes) * 100)));
  };

  const verdictPill =
    porcentaje >= 70
      ? 'bg-tertiary-fixed text-on-tertiary-fixed'
      : porcentaje >= 40
        ? 'bg-secondary-fixed text-on-secondary-fixed'
        : 'bg-error-container text-error';

  const verdictText =
    porcentaje >= 70
      ? 'Condición favorable según tus respuestas'
      : porcentaje >= 40
        ? 'Observaciones reportadas en el cuestionario'
        : 'Revisión presencial recomendada';

  const countForFilter = (filter: ComponentFilter) =>
    filter === 'all'
      ? informe.partes.length
      : informe.partes.filter((p) => filterForPart(p) === filter).length;

  return (
    <div className="w-full pt-20 bg-surface min-h-[calc(100vh-140px)]">
      {/* Breadcrumb */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
          <button onClick={() => onNavigate('dashboard')} className="hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-label-md">home</span>
          </button>
          <span>/</span>
          <span className="text-outline">AutoCheck Web</span>
          <span>/</span>
          <span className="text-primary font-bold">Consola Central</span>
        </nav>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Barra Superior de Acciones del Informe */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30 mb-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase tracking-wider font-bold">
                Diagnóstico de prueba, sin IA
              </span>
              <span className="text-outline font-label-sm text-label-sm">•</span>
              <span className="text-outline font-label-sm text-label-sm uppercase font-mono">Folio: {informe.folio}</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              Informe de Preperitaje Preliminar #{informe.folio}
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-label-lg text-outline">calendar_today</span>
              <span>
                Fecha de emisión: {formatDate(informe.fecha)} | Usuario: {usuario.nombre}
                {usuario.correo ? ` (${usuario.correo})` : ''}
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg transition-all shadow-sm cursor-pointer border border-outline-variant/30"
              type="button"
            >
              <span className="material-symbols-outlined text-label-lg">{copied ? 'check' : 'share'}</span>
              <span>{copied ? '¡Enlace Copiado!' : 'Compartir Enlace'}</span>
            </button>
            <button
              onClick={() => onNavigate('ficha-venta')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-all shadow-sm cursor-pointer border border-emerald-300"
              type="button"
            >
              <span className="material-symbols-outlined text-sm text-emerald-600">verified</span>
              <span>Ficha de Venta / Aceite & Llantas</span>
            </button>
            <button
              onClick={() => onNavigate('visor-a4')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-lg text-label-lg transition-all shadow-sm cursor-pointer border border-outline-variant/30"
              type="button"
            >
              <span className="material-symbols-outlined text-label-lg">description</span>
              <span>Ver Certificado A4</span>
            </button>
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg transition-all shadow-md cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-label-lg">{downloading ? 'sync' : 'download'}</span>
              <span>{downloading ? 'Compilando...' : 'Descargar PDF Oficial'}</span>
            </button>
          </div>
        </div>

        {/* Banner de Advertencia Legal Preventiva */}
        <div className="w-full bg-surface-container-low rounded-xl p-4 shadow-sm mb-8 flex items-start gap-4 border border-outline-variant/30">
          <div className="p-2 rounded-lg bg-secondary-fixed text-on-secondary-fixed flex-shrink-0 mt-0.5">
            <span className="material-symbols-outlined text-headline-sm">policy</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wide font-bold">Aviso Legal y Orientativo</span>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
                No Vinculante
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mt-1">
              Este informe se construye con reglas simples a partir de las respuestas y fotografías que registraste. No utiliza inteligencia artificial todavía y no constituye una certificación técnica oficial ni reemplaza un peritaje profesional presencial.
            </p>
          </div>
        </div>

        {/* Fila Superior: Resumen Ejecutivo y Puntuación General (Bento Mosaic) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Score Gauge & Veredicto (4 Cols) */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden border border-outline-variant/30">
            <div className="absolute -right-12 -top-12 w-44 h-44 bg-tertiary-fixed/30 rounded-full blur-2xl pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">Índice según Respuestas</span>
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary font-bold bg-tertiary-fixed/50 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                  Diagnóstico de prueba, sin IA
                </span>
              </div>
              <div className="flex flex-col items-center justify-center my-2 text-center">
                {/* Radial SVG Gauge */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                    <circle className="text-surface-container-high" cx="70" cy="70" fill="transparent" r="58" stroke="currentColor" strokeWidth="10" />
                    <circle
                      className="text-secondary transition-all duration-1000 ease-out"
                      cx="70"
                      cy="70"
                      fill="transparent"
                      r="58"
                      stroke="currentColor"
                      strokeDasharray="364.4"
                      strokeDashoffset={gaugeOffset}
                      strokeLinecap="round"
                      strokeWidth="10"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-headline-xl text-headline-xl text-primary leading-none font-bold">{porcentaje}</span>
                    <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider">de 100</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className={`px-4 py-1 rounded-full font-label-lg text-label-lg font-bold ${verdictPill}`}>
                    {verdictText}
                  </span>
                  <p className="font-body-sm text-body-sm text-outline mt-2 max-w-xs">
                    {resumen.partesBuenas} de {resumen.totalPartes} partes fueron reportadas en buen estado en el cuestionario.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 bg-surface-container-low rounded-lg p-3 flex items-center justify-between border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-label-lg">verified</span>
                <span className="font-body-sm text-body-sm text-on-surface font-semibold">Partes evaluadas</span>
              </div>
              <span className="font-label-md text-label-md text-tertiary font-bold">{resumen.totalPartes} registradas</span>
            </div>
          </div>

          {/* Ficha del Carro & Imagen Técnica (4 Cols) */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-md flex flex-col justify-between border border-outline-variant/30">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">Identificación Técnica</span>
                <span className="px-2.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold tracking-widest">
                  {vehiculo.placa || 'SIN PLACA'}
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-primary leading-tight font-bold">
                {vehiculo.marca || 'Vehículo'} {vehiculo.linea || ''}
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                Año {vehiculo.anio || 'N/D'} • {vehiculo.color || 'Color N/D'} • {vehiculo.combustible || 'Combustible N/D'} • {vehiculo.transmision || 'Transmisión N/D'}
              </p>
              <div className="relative w-full h-40 rounded-lg overflow-hidden bg-surface-container shadow-inner mb-4">
                {fotos[0] ? (
                  <img
                    className="w-full h-full object-cover"
                    alt={fotos[0].zonaEtiqueta}
                    src={assetUrl(fotos[0].url)}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-outline gap-1">
                    <span className="material-symbols-outlined text-headline-lg">no_photography</span>
                    <span className="font-label-sm text-label-sm">Sin fotos subidas</span>
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-on-surface/80 backdrop-blur-sm text-on-primary px-2 py-0.5 rounded font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-label-sm text-tertiary-fixed">photo_camera</span>
                  <span>{fotos.length} Fotos</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline block">Odómetro</span>
                  <span className="font-label-lg text-label-lg text-primary font-bold">{formatNumber(vehiculo.kilometraje)} km</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline block">Año Modelo</span>
                  <span className="font-label-lg text-label-lg text-tertiary font-bold">{vehiculo.anio || 'N/D'}</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline block">Transmisión</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">{vehiculo.transmision || 'N/D'}</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline block">Combustible</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">{vehiculo.combustible || 'N/D'}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-outline font-label-sm text-label-sm pt-2 border-t border-surface-container">
              <span>Registro: {formatDate(informe.fecha)}</span>
              <span className="text-secondary font-bold">{usuario.nombre}</span>
            </div>
          </div>

          {/* Resumen del Cuestionario (4 Cols) */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-md flex flex-col justify-between border border-outline-variant/30">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">Resumen del Cuestionario</span>
                <span className="material-symbols-outlined text-secondary">fact_check</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Partes evaluadas en el paso 2</span>
              <div className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                {resumen.totalPartes} partes <span className="font-label-sm text-label-sm font-normal text-outline">registradas</span>
              </div>
              <div className="p-3.5 bg-primary-fixed/40 rounded-lg mt-3 mb-4 border border-primary/20">
                <span className="font-label-sm text-label-sm text-on-primary-fixed uppercase tracking-wider block font-bold">
                  Partes con observaciones
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline-md text-headline-md text-primary font-bold">{resumen.partesConProblemas}</span>
                  <span className="font-label-md text-label-md text-primary font-semibold">reportadas</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-primary-fixed-variant mt-1 leading-snug">
                  Incluye las partes que marcaste con rayones, golpes, repintado o piezas rotas.
                </p>
              </div>

              {/* Gráfico de Factores de Impacto */}
              <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider block mb-2 font-semibold">
                Detalle de Respuestas
              </span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface-variant">Partes en buen estado</span>
                    <span className="text-tertiary font-bold">{resumen.partesBuenas}</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-tertiary h-full rounded-full" style={{ width: `${pct(resumen.partesBuenas)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface-variant">Partes con problemas</span>
                    <span className="text-error font-bold">{resumen.partesConProblemas}</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-error h-full rounded-full" style={{ width: `${pct(resumen.partesConProblemas)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface-variant">Respuestas con detalle escrito</span>
                    <span className="text-secondary font-bold">{resumen.partesConObservaciones}</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: `${pct(resumen.partesConObservaciones)}%` }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface-variant">Partes no aplicables</span>
                    <span className="text-primary font-bold">{noAplicables}</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full rounded-full" style={{ width: `${pct(noAplicables)}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 text-outline font-label-sm text-label-sm flex items-center gap-1 border-t border-surface-container mt-3">
              <span className="material-symbols-outlined text-label-sm">info</span>
              <span>Calculado a partir de las respuestas del paso 2</span>
            </div>
          </div>
        </div>

        {/* Sección Diagnóstico Detallado por Componentes */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-md mb-8 border border-outline-variant/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 gap-3 border-b border-surface-container">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">Diagnóstico de prueba, sin IA</span>
              <h2 className="font-headline-md text-headline-md text-primary font-bold">Diagnóstico Detallado por Componentes</h2>
            </div>
            {/* Categorías / Tabs */}
            <div className="flex flex-wrap gap-1 p-1 bg-surface-container-low rounded-lg border border-outline-variant/30">
              {FILTER_LABELS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setComponentFilter(tab.id)}
                  className={`px-3 py-1.5 rounded font-label-md text-label-md transition-colors cursor-pointer ${
                    componentFilter === tab.id
                      ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  type="button"
                >
                  {tab.label} ({countForFilter(tab.id)})
                </button>
              ))}
            </div>
          </div>

          {/* Lista de Hallazgos y Severidad */}
          <div className="space-y-3 mt-4">
            {partesFiltradas.length === 0 && (
              <div className="p-4 rounded-xl bg-surface-container-low flex items-center justify-center border border-outline-variant/20">
                <p className="font-body-md text-body-md text-on-surface-variant">
                  No hay partes registradas para este filtro.
                </p>
              </div>
            )}

            {partesFiltradas.map((part) => {
              const badge = statusBadge(part);
              return (
                <div
                  key={part.id}
                  className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-outline-variant/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0 text-primary">
                      <span className="material-symbols-outlined">{iconForPart(part)}</span>
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-label-lg text-label-lg text-on-surface font-bold">{part.nombre}</span>
                        <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                          {part.categoriaEtiqueta}
                        </span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                        {part.condicionEtiqueta}.{' '}
                        {part.observaciones || 'Sin observaciones adicionales registradas.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 flex items-center gap-2 self-end md:self-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-md text-label-md font-bold ${badge.classes}`}>
                      <span className={`w-2 h-2 rounded-full ${badge.dot}`}></span>
                      {badge.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sección: Recomendación y Próximos Pasos (Call To Action Asimétrico) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Tarjeta Veredicto CTA */}
          <div className="lg:col-span-8 bg-primary rounded-xl p-6 lg:p-8 text-on-primary shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-secondary/30 rounded-full blur-3xl pointer-events-none"></div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm uppercase font-bold tracking-wider">
                  Diagnóstico de prueba, sin IA
                </span>
                <span className="text-primary-fixed font-label-sm text-label-sm font-semibold">• Recomendación según respuestas</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg leading-tight mb-4 text-primary-fixed font-bold">
                ¿Vale la pena hacer un peritaje profesional?
              </h3>
              <div className="p-4 rounded-lg bg-primary-container/60 mb-6 border border-white/10">
                <div className="flex items-center gap-2 text-tertiary-fixed font-bold mb-1">
                  <span className="material-symbols-outlined text-headline-sm">
                    {resumen.partesConProblemas > 0 ? 'warning' : 'check_circle'}
                  </span>
                  <span className="font-headline-sm text-headline-sm tracking-wide">
                    {resumen.partesConProblemas > 0
                      ? 'REVISIÓN PRESENCIAL RECOMENDADA'
                      : 'SIN PROBLEMAS REPORTADOS'}
                  </span>
                </div>
                <p className="font-body-lg text-body-lg text-on-primary-container leading-relaxed">
                  {diagnostico.texto} {diagnostico.recomendacion}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-1">
              <button
                onClick={() => alert('Abriendo agenda con centro de peritaje aliado Colserauto...')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-tertiary-fixed hover:bg-tertiary-fixed-dim text-on-tertiary-fixed font-label-lg text-label-lg font-bold shadow-md transition-all cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined">event_available</span>
                <span>Agendar Peritaje Certificado con Aliados</span>
              </button>
              <div className="flex items-center gap-2 text-primary-fixed font-label-md text-label-md">
                <span className="px-2 py-1 rounded bg-secondary-fixed text-on-secondary-fixed font-bold">-15% OFF</span>
                <span>Cupón exclusivo AutoCheck aplicado</span>
              </div>
            </div>
          </div>

          {/* Red de Peritajes Aliados (4 Cols) */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-md flex flex-col justify-between border border-outline-variant/30">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">Centros Autorizados</span>
              <h4 className="font-headline-sm text-headline-sm text-primary mt-1 mb-2 font-bold">Red de Aliados Físicos</h4>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
                Puntos técnicos equipados con medidor ultrasónico de espesor de pintura y scanner OBD-II de nivel concesionario:
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-label-lg">location_on</span>
                    <span className="font-body-sm text-body-sm text-on-surface font-semibold">AutoSura Calle 127</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary font-bold">A 3.2 km</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-label-lg">location_on</span>
                    <span className="font-body-sm text-body-sm text-on-surface font-semibold">Colserauto Morato</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary font-bold">A 4.8 km</span>
                </div>
                <div className="p-3 rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-label-lg">location_on</span>
                    <span className="font-body-sm text-body-sm text-on-surface font-semibold">CDA Automás Suba</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-tertiary font-bold">A 6.1 km</span>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 bg-surface-container-high rounded-lg p-3 flex items-center gap-2 text-on-surface border border-outline-variant/20">
              <span className="material-symbols-outlined text-primary text-headline-sm">security</span>
              <span className="font-label-sm text-label-sm leading-tight">
                Garantía de peritaje respaldada por póliza de transparencia de inspección.
              </span>
            </div>
          </div>
        </div>

        {/* Galería Rápida de Inspección Fotográfica */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-md mb-8 border border-outline-variant/30">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">Registro Evidencial</span>
              <h3 className="font-headline-sm text-headline-sm text-primary font-bold">Evidencias Fotográficas Digitalizadas</h3>
            </div>
            <button
              onClick={() => onNavigate('visor-a4')}
              className="text-secondary font-label-md text-label-md font-bold cursor-pointer hover:underline flex items-center gap-1"
            >
              <span>Ver en informe técnico A4</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {fotos.length === 0 && (
              <div className="group relative rounded-lg overflow-hidden bg-surface-container shadow-sm aspect-video border border-outline-variant/30 flex flex-col items-center justify-center gap-1">
                <span className="material-symbols-outlined text-headline-sm text-outline">no_photography</span>
                <span className="font-body-sm text-body-sm text-outline">Sin fotos subidas</span>
              </div>
            )}
            {fotos.map((foto, index) => (
              <div
                key={foto.id}
                className="group relative rounded-lg overflow-hidden bg-surface-container shadow-sm aspect-video border border-outline-variant/30"
              >
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  alt={foto.zonaEtiqueta}
                  src={assetUrl(foto.url)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
                <span className="absolute bottom-2 left-2 text-on-primary font-label-sm text-label-sm font-semibold">{foto.zonaEtiqueta}</span>
                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                  Foto {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Créditos Académicos e Institucionales en el Pie del Reporte */}
        <div className="w-full rounded-xl bg-surface-container-low p-6 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm border border-outline-variant/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-primary flex-shrink-0 font-bold shadow-xs">
              <span className="material-symbols-outlined text-headline-sm">school</span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-lg text-label-lg text-primary font-bold">Corporación Universitaria Minuto de Dios — UNIMINUTO</span>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Facultad de Ingeniería • Programa de Ingeniería de Sistemas
              </p>
              <p className="font-body-sm text-body-sm text-slate-700 mt-1">
                <strong>Profesionales Responsables:</strong> Ing. Duban Tibaquira &amp; Ing. Leni Murillo &nbsp;|&nbsp; <em>Profesionales en Ingeniería de Sistemas</em>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-outline font-label-sm text-label-sm">
            <span className="material-symbols-outlined text-label-md text-tertiary">lock_clock</span>
            <span>AutoCheck Engine v2.4 (Diagnóstico por reglas)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
