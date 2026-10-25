import React, { useState } from 'react';
import { ScreenId } from '../types';

interface InformeDetalladoScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const InformeDetalladoScreen: React.FC<InformeDetalladoScreenProps> = ({ onNavigate }) => {
  const [componentFilter, setComponentFilter] = useState<'all' | 'carroceria' | 'optica' | 'frenos' | 'interior'>('all');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

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
                Auditado por IA Multimodal
              </span>
              <span className="text-outline font-label-sm text-label-sm">•</span>
              <span className="text-outline font-label-sm text-label-sm uppercase font-mono">Cripto-Hash: 9F8A2D...B4</span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">Informe de Preperitaje Preliminar #AC-2026-0842</h1>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-1.5 mt-0.5">
              <span className="material-symbols-outlined text-label-lg text-outline">calendar_today</span>
              <span>Fecha de emisión: 02 de Agosto, 2026 | Hora: 14:35 UTC-5</span>
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
              Este informe ha sido generado mediante algoritmos de Visión Artificial Multimodal y análisis cruzado de datos proporcionados por el usuario. No constituye una certificación técnica oficial ni reemplaza un peritaje profesional presencial en banco hidromecánico, fosa de inspección y escáner OBD-II en vivo.
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
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">Índice de Confianza IA</span>
                <span className="inline-flex items-center gap-1 font-label-sm text-label-sm text-tertiary font-bold bg-tertiary-fixed/50 px-2.5 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                  98.2% Fiabilidad
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
                      strokeDashoffset="51"
                      strokeLinecap="round"
                      strokeWidth="10"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="font-headline-xl text-headline-xl text-primary leading-none font-bold">86</span>
                    <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider">de 100</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="px-4 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-lg text-label-lg font-bold">
                    Condición Favorable / Muy Buena
                  </span>
                  <p className="font-body-sm text-body-sm text-outline mt-2 max-w-xs">
                    El vehículo conserva más del 90% de sus especificaciones de fábrica con anomalías cosméticas de bajo impacto.
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-4 mt-4 bg-surface-container-low rounded-lg p-3 flex items-center justify-between border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-label-lg">verified</span>
                <span className="font-body-sm text-body-sm text-on-surface font-semibold">Integridad Estructural</span>
              </div>
              <span className="font-label-md text-label-md text-tertiary font-bold">Aprobada (100%)</span>
            </div>
          </div>

          {/* Ficha del Carro & Imagen Técnica (4 Cols) */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-md flex flex-col justify-between border border-outline-variant/30">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">Identificación Técnica</span>
                <span className="px-2.5 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold tracking-widest">
                  KRM-514
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-primary leading-tight font-bold">Mazda CX-30 2022</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">Grand Touring 2.0L SkyActiv-G • AT Secuencial 6 Vel</p>
              <div className="relative w-full h-40 rounded-lg overflow-hidden bg-surface-container shadow-inner mb-4">
                <img
                  className="w-full h-full object-cover"
                  alt="Mazda CX-30 2022"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDu7h7efwQUPM5CuP9AKyGXXwMadkbdaG0Xv9kkUJWlsPzFXibQhuXK-VfoyyzZw-4f_nXKx4u1Thju7YKOCazbnzwHYh28HtQBIUVvfhYqJg1dJ9EC2AbTUnaFATVx9Ej2EYUNARgoOnDHwtxBwZF7A1tFa4AKItN-Dnj9_7mz8cJP1an8YKMOFY0m0PT75nHt4l7khYROCMvtFVjCFBSQV1OzieQ5f4XqAnyNTNhqewYOL9Lgyfmp"
                />
                <div className="absolute bottom-2 left-2 bg-on-surface/80 backdrop-blur-sm text-on-primary px-2 py-0.5 rounded font-label-sm text-label-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-label-sm text-tertiary-fixed">photo_camera</span>
                  <span>18 Tomas Procesadas</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline block">Odómetro Real</span>
                  <span className="font-label-lg text-label-lg text-primary font-bold">38.400 km</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline block">Historial RUNT</span>
                  <span className="font-label-lg text-label-lg text-tertiary font-bold">Único Dueño</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline block">Transmisión</span>
                  <span className="font-label-md text-label-md text-on-surface font-semibold">4x2 Delantera</span>
                </div>
                <div className="p-2.5 bg-surface-container-low rounded border border-outline-variant/20">
                  <span className="font-label-sm text-label-sm text-outline block">Siniestros Vía Fasecolda</span>
                  <span className="font-label-md text-label-md text-tertiary font-bold">0 Registros</span>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-outline font-label-sm text-label-sm pt-2 border-t border-surface-container">
              <span>VIN: 3MZDM5AB6NM****89</span>
              <span className="text-secondary font-bold">Bogotá D.C.</span>
            </div>
          </div>

          {/* Rango Estimado de Mercado & Devaluación (4 Cols) */}
          <div className="lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 shadow-md flex flex-col justify-between border border-outline-variant/30">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">Tasación Inteligente</span>
                <span className="material-symbols-outlined text-secondary">trending_up</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Rango comercial estimado</span>
              <div className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                $88.500.000 – $93.000.000 <span className="font-label-sm text-label-sm font-normal text-outline">COP</span>
              </div>
              <div className="p-3.5 bg-primary-fixed/40 rounded-lg mt-3 mb-4 border border-primary/20">
                <span className="font-label-sm text-label-sm text-on-primary-fixed uppercase tracking-wider block font-bold">
                  Valor Recomendado de Cierre
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="font-headline-md text-headline-md text-primary font-bold">$91.200.000</span>
                  <span className="font-label-md text-label-md text-primary font-semibold">COP</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-primary-fixed-variant mt-1 leading-snug">
                  Punto óptimo para compra directa sin sobreprecio respecto al estado actual.
                </p>
              </div>

              {/* Gráfico de Factores de Impacto */}
              <span className="font-label-sm text-label-sm uppercase text-outline tracking-wider block mb-2 font-semibold">
                Matriz de Sensibilidad de Precio
              </span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface-variant">Año/Modelo (2022)</span>
                    <span className="text-tertiary font-bold">+3.0%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-tertiary h-full rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface-variant">Bajo Kilometraje Promedio</span>
                    <span className="text-tertiary font-bold">+4.0%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-tertiary h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface-variant">Repintado Parcial Detectado</span>
                    <span className="text-error font-bold">-2.0%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-error h-full rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-label-sm text-label-sm mb-1">
                    <span className="text-on-surface-variant">Liquidez de Mercado Mazda CX</span>
                    <span className="text-secondary font-bold">+1.0%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full rounded-full" style={{ width: '55%' }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 text-outline font-label-sm text-label-sm flex items-center gap-1 border-t border-surface-container mt-3">
              <span className="material-symbols-outlined text-label-sm">info</span>
              <span>Basado en 142 transacciones similares en los últimos 45 días</span>
            </div>
          </div>
        </div>

        {/* Sección Diagnóstico Detallado por Componentes */}
        <div className="bg-surface-container-lowest rounded-xl p-6 shadow-md mb-8 border border-outline-variant/30">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 gap-3 border-b border-surface-container">
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-outline">Desglose Técnico Paramétrico</span>
              <h2 className="font-headline-md text-headline-md text-primary font-bold">Diagnóstico Detallado por Componentes</h2>
            </div>
            {/* Categorías / Tabs */}
            <div className="flex flex-wrap gap-1 p-1 bg-surface-container-low rounded-lg border border-outline-variant/30">
              <button
                onClick={() => setComponentFilter('all')}
                className={`px-3 py-1.5 rounded font-label-md text-label-md transition-colors cursor-pointer ${
                  componentFilter === 'all'
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
                type="button"
              >
                Todos (8)
              </button>
              <button
                onClick={() => setComponentFilter('carroceria')}
                className={`px-3 py-1.5 rounded font-label-md text-label-md transition-colors cursor-pointer ${
                  componentFilter === 'carroceria'
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
                type="button"
              >
                Carrocería & Pintura
              </button>
              <button
                onClick={() => setComponentFilter('optica')}
                className={`px-3 py-1.5 rounded font-label-md text-label-md transition-colors cursor-pointer ${
                  componentFilter === 'optica'
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
                type="button"
              >
                Óptica & Cristales
              </button>
              <button
                onClick={() => setComponentFilter('frenos')}
                className={`px-3 py-1.5 rounded font-label-md text-label-md transition-colors cursor-pointer ${
                  componentFilter === 'frenos'
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
                type="button"
              >
                Llantas & Frenos
              </button>
              <button
                onClick={() => setComponentFilter('interior')}
                className={`px-3 py-1.5 rounded font-label-md text-label-md transition-colors cursor-pointer ${
                  componentFilter === 'interior'
                    ? 'bg-surface-container-lowest text-primary font-bold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-high'
                }`}
                type="button"
              >
                Interior & Cabina
              </button>
            </div>
          </div>

          {/* Lista de Hallazgos y Severidad */}
          <div className="space-y-3 mt-4">
            {/* Item 1: Amarillo */}
            {(componentFilter === 'all' || componentFilter === 'carroceria') && (
              <div className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-outline-variant/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0 text-primary">
                    <span className="material-symbols-outlined">format_paint</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">Guardabarros Delantero Derecho</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                        Carrocería
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                      Posible repintado estético sin alteración estructural en pernos ni soporte de chasis. Espesor de micromilésimas irregular detectado por sensor óptico.
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 self-end md:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-bold">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Atención sugerida
                  </span>
                </div>
              </div>
            )}

            {/* Item 2: Verde */}
            {(componentFilter === 'all' || componentFilter === 'optica') && (
              <div className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-outline-variant/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0 text-primary">
                    <span className="material-symbols-outlined">highlight</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">Ópticas y Faros LED Frontales / Posteriores</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                        Óptica
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                      Excelente estado de policarbonato, sin fisuras, opacamiento por UV ni condensación interna visible. Soportes originales alineados.
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 self-end md:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md font-bold">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    Óptimo
                  </span>
                </div>
              </div>
            )}

            {/* Item 3: Verde */}
            {(componentFilter === 'all' || componentFilter === 'interior') && (
              <div className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-outline-variant/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0 text-primary">
                    <span className="material-symbols-outlined">airline_seat_recline_normal</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">Desgaste de Tapicería en Cuero y Volante</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                        Interior
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                      Pátina normal y sin rasgaduras. Grado de abrasión en pedales y timón plenamente congruente con el kilometraje reportado de 38.400 km.
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 self-end md:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md font-bold">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    Óptimo
                  </span>
                </div>
              </div>
            )}

            {/* Item 4: Amarillo */}
            {(componentFilter === 'all' || componentFilter === 'frenos') && (
              <div className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-outline-variant/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0 text-primary">
                    <span className="material-symbols-outlined">tire_repair</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">Espesor de Pastillas de Freno Posteriores</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                        Frenos & Rodamiento
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                      Revisión en fosa técnica sugerida: las imágenes evidencian leve rebaje en el disco posterior derecho compatible con desgaste del 60% de material de fricción.
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 self-end md:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md text-label-md font-bold">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    Atención sugerida
                  </span>
                </div>
              </div>
            )}

            {/* Item 5: Verde (Cristales) */}
            {(componentFilter === 'all' || componentFilter === 'optica') && (
              <div className="p-4 rounded-xl bg-surface-container-low hover:bg-surface-container transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-outline-variant/20">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center flex-shrink-0 text-primary">
                    <span className="material-symbols-outlined">crop_square</span>
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">Panorámico y Ventanas Laterales</span>
                      <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                        Cristales
                      </span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
                      Serigrafía original Mazda Nippon Glass coincidente en los 6 cristales. Sin impactos de gravilla con microfisuras activas.
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2 self-end md:self-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed font-label-md text-label-md font-bold">
                    <span className="w-2 h-2 rounded-full bg-tertiary"></span>
                    Óptimo
                  </span>
                </div>
              </div>
            )}
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
                  Dictamen Algorítmico
                </span>
                <span className="text-primary-fixed font-label-sm text-label-sm font-semibold">• Recomendación de Compra</span>
              </div>
              <h3 className="font-headline-lg text-headline-lg leading-tight mb-4 text-primary-fixed font-bold">
                ¿Vale la pena hacer un peritaje profesional?
              </h3>
              <div className="p-4 rounded-lg bg-primary-container/60 mb-6 border border-white/10">
                <div className="flex items-center gap-2 text-tertiary-fixed font-bold mb-1">
                  <span className="material-symbols-outlined text-headline-sm">check_circle</span>
                  <span className="font-headline-sm text-headline-sm tracking-wide">SÍ, TOTALMENTE RECOMENDADO</span>
                </div>
                <p className="font-body-lg text-body-lg text-on-primary-container leading-relaxed">
                  El vehículo muestra una condición general sobresaliente (Score 86/100) y nuestro análisis descarta siniestros graves visibles o disparidades de kilometraje. Un peritaje profesional presencial en fosa confirmará el estado de la caja de cambios SkyActiv-Drive, suspensión trasera y confirmará si el repintado del guardabarros derecho involucró piezas internas.
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
            <div className="group relative rounded-lg overflow-hidden bg-surface-container shadow-sm aspect-video border border-outline-variant/30">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                alt="Guardabarros Del. Der."
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGY4LAER2byHGzzMPmAiBsc3fYJGYqxfYlJ99SXBajvVCRuf_oSmbKKCheIGDc5v2c9T31Ew1wDr9iGWeGPUzOLxVSp_OY2TLD-thY1_9cO_12XGaBUPqayrFa8OSp-I6-EI87KF6FGO8uqYoZgmvQn75hj5_M3wHXRbrKC-wbeKtpQMfeLIs9vWyLcqQHzQDDmy5w1IFiLRdXYEYImFYDCgGTHlyB58EJ7ZaEBILyqn_vA6KPC3iS"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
              <span className="absolute bottom-2 left-2 text-on-primary font-label-sm text-label-sm font-semibold">Guardabarros Del. Der.</span>
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                Repintado
              </span>
            </div>
            <div className="group relative rounded-lg overflow-hidden bg-surface-container shadow-sm aspect-video border border-outline-variant/30">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                alt="Óptica LED Delantera"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDdbstrLVwkZ6hPZ02isGx6FUfR99O9lnTaOQb1oF_tG7r_QBSmu6K5BxuJuX3qODxbIz8NHSLbo_MCjY7bUtdj6Tzay9K4z6ZeqSY2yAs7GhU9ybaCDt_Rt7LnJLMmoYZgo1T3sbY_Tq_vvnk7UuBKIYy5dgikIsmmF_k-4w2z5vPq4cuG-0v7zZj7H8DdH1pnUT9-GFUqQPNzeJ8CqGSEXOFClf9d3B-rOVxc1LvS4w4eRXAO7uTk"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
              <span className="absolute bottom-2 left-2 text-on-primary font-label-sm text-label-sm font-semibold">Óptica LED Delantera</span>
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                100% Genuino
              </span>
            </div>
            <div className="group relative rounded-lg overflow-hidden bg-surface-container shadow-sm aspect-video border border-outline-variant/30">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                alt="Habitáculo y Odómetro"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBktKtz5rWKaz5OSrb2bqikF8KuPLVK44O2yGuBFjlAOzIvDaj1ov4Tib_9WY3P6gsb7WHrHtNna9PPuujec7yu9adNr6oPEUUYoEX9EacC-5BBRTg1Omr179-BZfqds05OI9Ap0dRLxeMSl5nC65ArwjRXXKhzbNkrZdGh1996QGR3RXcg0E5HTeNiX-whiVGVxif9fEsGrIN291jIZnx9YzMCBtA4spUQZmp7f66a2Yqn5DsQrx1f"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
              <span className="absolute bottom-2 left-2 text-on-primary font-label-sm text-label-sm font-semibold">Habitáculo y Odómetro</span>
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold">
                Verificado
              </span>
            </div>
            <div className="group relative rounded-lg overflow-hidden bg-surface-container shadow-sm aspect-video border border-outline-variant/30">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                alt="Rueda y Freno Posterior"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1y5duRTQK1QqUJnHhMFm9EDVEppudnUDKLoN-JxIXkSM9n_EqlXy4LO4kMIdrlYc1nw1m-Hkg6fUJPR3hABU-mOiAPmlmCQhVc1hqf13mndMUpN-aArWpe0DwTJ6GldxwitHRpN9koirV2dcmzKdDiogg6bsizhoFmTEFA85RB7kgIHPBWnM8SFFs0AJM_EP0Kh9EGOgrbQkpW399DfZsl8DOAapmOzkNkO_KVfe0p_J2_VOdVjVq"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
              <span className="absolute bottom-2 left-2 text-on-primary font-label-sm text-label-sm font-semibold">Rueda y Freno Posterior</span>
              <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold">
                Desgaste 60%
              </span>
            </div>
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
            <span>AutoCheck Engine v2.4 (Model ID: AC-LLM-VISION-PRO)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
