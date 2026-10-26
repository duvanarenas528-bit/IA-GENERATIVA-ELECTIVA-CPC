import React, { useState, useEffect } from 'react';
import { ScreenId } from '../types';

interface AnalisisVivoScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const AnalisisVivoScreen: React.FC<AnalisisVivoScreenProps> = ({ onNavigate }) => {
  const [showBoxes, setShowBoxes] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(82);
  const [activeThumb, setActiveThumb] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 82 : prev + 2));
    }, 1200);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <div className="w-full pt-20 bg-surface min-h-[calc(100vh-140px)]">
      {/* Breadcrumb */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-on-surface-variant font-label-md text-label-md">
          <button onClick={() => onNavigate('dashboard')} className="hover:underline flex items-center gap-1">
            <span className="material-symbols-outlined text-label-md">home</span>
          </button>
          <span>/</span>
          <button onClick={() => onNavigate('nuevo-preperitaje')} className="hover:underline">
            AutoCheck Web
          </button>
          <span>/</span>
          <span className="text-primary font-bold">Análisis IA en Vivo</span>
        </nav>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col gap-6">
        {/* Progress & Status Header Card */}
        <section className="bg-surface-container-lowest rounded-xl shadow-md p-6 flex flex-col gap-4 border border-outline-variant/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm uppercase tracking-wider font-semibold">
                  Módulo de Visión Computacional
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded bg-tertiary-container text-on-tertiary font-label-sm text-label-sm">
                  <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse"></span>
                  <span>Procesamiento en Tiempo Real • Gemini 1.5 Pro Multimodal</span>
                </span>
              </div>
              <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">
                Analizando Mazda CX-30 2022 <span className="text-primary font-headline-md text-headline-md font-bold">(Placa KRM-514)</span>
              </h1>
              <p className="font-body-md text-body-md text-outline">
                Cotejo multidimensional de fotos de alta resolución, detección de microrayones y verificación estructural de chapa.
              </p>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-1.5 min-w-[280px]">
              <div className="flex items-center justify-between w-full font-label-md text-label-md">
                <span className="text-on-surface-variant flex items-center gap-1">
                  <span className="material-symbols-outlined text-label-md text-primary">hourglass_top</span>
                  <span>Tiempo estimado restante</span>
                </span>
                <span className="text-primary font-bold">
                  {progress >= 100 ? 'Listo para informe' : `~${Math.max(1, Math.round((100 - progress) / 3))} segundos (${progress}%)`}
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-surface-container-high overflow-hidden relative">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${progress}%` }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-secondary-fixed/50 to-transparent animate-pulse pointer-events-none"></div>
              </div>
              <div className="flex items-center justify-between w-full font-label-sm text-label-sm text-outline">
                <span>Fase 4/5: Dispersión espectral y espesor</span>
                <span className="font-bold text-tertiary-container">Pipeline Estable</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Dual Column Workspace */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Computer Vision Viewport (7 Cols) */}
          <section className="xl:col-span-7 flex flex-col gap-4">
            <div className="bg-surface-container-lowest rounded-xl shadow-md p-4 flex flex-col gap-4 border border-outline-variant/30">
              {/* Viewport Header Toolbar */}
              <div className="flex items-center justify-between px-1 pb-1">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-primary text-headline-sm">document_scanner</span>
                  <div>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface leading-tight font-bold">
                      Visor de Detección Multidimensional
                    </h2>
                    <p className="font-label-sm text-label-sm text-outline">Resolución de entrada: 4032 × 3024 px • Matriz de contraste activo</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm flex items-center gap-1 font-mono">
                    <span className="material-symbols-outlined text-label-sm text-secondary">crop_free</span>
                    <span>3 Bounding Boxes</span>
                  </span>
                  <button
                    onClick={() => setShowBoxes(!showBoxes)}
                    className="px-3 py-1 rounded bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-sm text-label-sm transition-colors cursor-pointer"
                    type="button"
                  >
                    {showBoxes ? 'Ocultar Capas' : 'Mostrar Capas'}
                  </button>
                </div>
              </div>

              {/* Interactive Viewport Canvas Area */}
              <div className="relative w-full h-[460px] rounded-lg overflow-hidden bg-on-surface-variant/10 select-none group border border-outline-variant/30">
                <img
                  className="w-full h-full object-cover"
                  alt="Mazda CX-30 scanning viewport"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAN7tIxf7WZOyqM5Dt8ZMAODY6CfVviduLu67TX8wXso5K_a1zOUeXui8O_ItCUOj-emodSJ9VTTbeXclXyM2EBcRHhoGCKnTUljt91MKx4l7aFIqn_nw18LBRfqnsx1dlM4SJLESHC3C1U9f4fqDkalYPOgAbNCS1rZr3IftMKU3uUpVmvpG1DXSFxVpkeZeHq4veZe85vJnIxhonuR7zcxPv8MP0-jJzrdrP_bhbWlIOzAeL9nUjG"
                />

                {/* Scanline Animation Overlay */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-secondary-container/20 to-transparent h-24 animate-[bounce_4s_infinite] opacity-60"></div>

                {/* Coordinate Crosshairs & Grid Overlays */}
                <div className="absolute top-3 left-3 bg-inverse-surface/80 backdrop-blur-md px-2.5 py-1 rounded text-inverse-on-surface font-label-sm text-label-sm flex items-center gap-1.5 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-ping"></span>
                  <span>ISO 100 • F/1.8 • EXIF MATCH</span>
                </div>

                {showBoxes && (
                  <>
                    {/* Bounding Box 1: Headlight / Faro Derecho */}
                    <div className="absolute top-[28%] left-[24%] w-[26%] h-[20%] transition-transform duration-200 hover:scale-[1.02]">
                      <div className="relative w-full h-full bg-secondary-fixed/20 shadow-sm rounded-sm border border-secondary">
                        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-secondary"></div>
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-secondary"></div>
                        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-secondary"></div>
                        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-secondary"></div>
                        <div className="absolute -top-7 left-0 whitespace-nowrap bg-primary-container text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded shadow-md flex items-center gap-1">
                          <span className="material-symbols-outlined text-label-sm text-secondary-container">highlight</span>
                          <span>Faro Delantero Der.: Desgaste superficial leve (96%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Bounding Box 2: Lower Bumper / Micro-rayón */}
                    <div className="absolute bottom-[24%] left-[44%] w-[22%] h-[16%] transition-transform duration-200 hover:scale-[1.02]">
                      <div className="relative w-full h-full bg-error-container/20 shadow-sm rounded-sm border border-error">
                        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-error"></div>
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-error"></div>
                        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-error"></div>
                        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-error"></div>
                        <div className="absolute -bottom-7 left-0 whitespace-nowrap bg-error text-on-error font-label-sm text-label-sm px-2 py-0.5 rounded shadow-md flex items-center gap-1">
                          <span className="material-symbols-outlined text-label-sm">warning</span>
                          <span>Parachoques: Micro-rayón superficial • Severidad Baja</span>
                        </div>
                      </div>
                    </div>

                    {/* Bounding Box 3: Rim & Tire / Profundidad labrado */}
                    <div className="absolute bottom-[10%] right-[10%] w-[28%] h-[34%] transition-transform duration-200 hover:scale-[1.02]">
                      <div className="relative w-full h-full bg-tertiary-container/20 shadow-sm rounded-sm border border-tertiary-fixed">
                        <div className="absolute -top-1 -left-1 w-2.5 h-2.5 bg-tertiary-fixed"></div>
                        <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-tertiary-fixed"></div>
                        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-tertiary-fixed"></div>
                        <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 bg-tertiary-fixed"></div>
                        <div className="absolute -top-7 right-0 whitespace-nowrap bg-tertiary text-on-tertiary font-label-sm text-label-sm px-2 py-0.5 rounded shadow-md flex items-center gap-1">
                          <span className="material-symbols-outlined text-label-sm text-tertiary-fixed">task_alt</span>
                          <span>Rin & Llanta: Labrado ~5.8 mm • Estado Bueno</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Hover Interaction Tip */}
                <div className="absolute bottom-3 right-3 bg-inverse-surface/85 text-inverse-on-surface px-2.5 py-0.5 rounded font-label-sm text-label-sm backdrop-blur pointer-events-none">
                  Pasa el cursor para aislar el hallazgo
                </div>
              </div>

              {/* Thumbnail Strip Selection */}
              <div className="flex flex-col gap-2 pt-1">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline">Fotos en Cola de Inspección Multimodal</span>
                <div className="grid grid-cols-4 gap-3">
                  <button
                    onClick={() => setActiveThumb(0)}
                    className={`relative rounded-lg overflow-hidden h-20 bg-surface-container shadow-sm p-1 text-left flex flex-col justify-end transition-all cursor-pointer ${
                      activeThumb === 0 ? 'ring-2 ring-primary' : 'opacity-85 hover:opacity-100'
                    }`}
                    type="button"
                  >
                    <img
                      className="absolute inset-0 w-full h-full object-cover -z-10"
                      alt="Frontal"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDS3PsS61TcltHtmx_Kxzvh5di3hx8m9uPEYBrq_X9N7SIXgzyJ9FtFOGX9_vJpfGuIQgvo5C9ZqsIhnn4g2jszaVznCSjrV-VHvz-cIF1ksD-1UW6QzmKyshmrmCfG8nCPFi5oIYA2sUbfojoTo_1wUHx3vLgwzTUvzN5XztgPQiohEQgyW0Vfmp2B-J18x838ljVm4C5VYUDm3jV_Hg79ukU4Tm__popTnu8PRHtkavuPYUOXstj-"
                    />
                    <div className="relative z-10 flex items-center justify-between w-full bg-inverse-surface/60 px-1.5 py-0.5 rounded">
                      <span className="font-label-sm text-label-sm text-white font-bold">Frontal / 3/4</span>
                      <span className="material-symbols-outlined text-label-sm text-tertiary-fixed">check_circle</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveThumb(1)}
                    className={`relative rounded-lg overflow-hidden h-20 bg-surface-container shadow-sm p-1 text-left flex flex-col justify-end transition-all cursor-pointer ${
                      activeThumb === 1 ? 'ring-2 ring-primary' : 'opacity-85 hover:opacity-100'
                    }`}
                    type="button"
                  >
                    <img
                      className="absolute inset-0 w-full h-full object-cover -z-10"
                      alt="Costado der."
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDA_QMn19-Jau7uLgKlFCJDoygH18m5pJH_tNsW_VQGXBNx-PJwgskAInWVq_itjehb9j7-xLh-AB3yGwvAoqPbNAAnG53FE9XrTLuj4bDSN-TRcUrR5oD1DqirbuN7acLXm1tM2iEqLApfbmApYtBBv3YP40_Mdblo13xqkv_gb02gcVmkOjZhirYwG1U-0YK5j7pxeV47Rk8mcFobZSqMmOr0sg9sBDhZNi159DTGmowwM6hvw5NS"
                    />
                    <div className="relative z-10 flex items-center justify-between w-full bg-inverse-surface/60 px-1.5 py-0.5 rounded">
                      <span className="font-label-sm text-label-sm text-white">Costado der.</span>
                      <span className="material-symbols-outlined text-label-sm text-secondary-container">sync</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveThumb(2)}
                    className={`relative rounded-lg overflow-hidden h-20 bg-surface-container shadow-sm p-1 text-left flex flex-col justify-end transition-all cursor-pointer ${
                      activeThumb === 2 ? 'ring-2 ring-primary' : 'opacity-85 hover:opacity-100'
                    }`}
                    type="button"
                  >
                    <img
                      className="absolute inset-0 w-full h-full object-cover -z-10"
                      alt="Motor"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDcAlc38wIIDUrhwK6_SZBEmhBSYmGJLuGrYUki4t7DMVKQB7BYQ41Smm4xN05U1wJ47KMLmNKLQ627Z0bCyu1yl5kuxqYgHKhoRzsptmKTJGy-3BRNyGzhb8EVkhgES_AKvzQ1tuHfARAWdGVYLnmUi0VW6_Ut7wrFc0eaggMN17AhU-lPqoz7ULducyQmZ6XcrAOu-e-_patOm9l1HjaszRqzdpIheOaTb5CfSJoSFya3fmahiwv7"
                    />
                    <div className="relative z-10 flex items-center justify-between w-full bg-inverse-surface/60 px-1.5 py-0.5 rounded">
                      <span className="font-label-sm text-label-sm text-white">Motor</span>
                      <span className="material-symbols-outlined text-label-sm text-tertiary-fixed">check_circle</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveThumb(3)}
                    className={`relative rounded-lg overflow-hidden h-20 bg-surface-container shadow-sm p-1 text-left flex flex-col justify-end transition-all cursor-pointer ${
                      activeThumb === 3 ? 'ring-2 ring-primary' : 'opacity-85 hover:opacity-100'
                    }`}
                    type="button"
                  >
                    <img
                      className="absolute inset-0 w-full h-full object-cover -z-10"
                      alt="Odómetro"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAH4COmqquAlb0d3BXyhWlMZn7h543P6MwUiKZsUQj1rzH7vWWNtLHlDmF17p7TzzFseXdNGQokQzah9K60MPcnKvf60-HKZ1Qskf0ku4UetCOZqNK6rdrjuS1PBB6Rp-78vhH2zmOeSEFmggcfy1f3r9LKWAIRmcGfVnfxb3Aff-mXbWOq5cCyYe_txQ_dJw-VzdesFSToLtfpAKUbU6vSXttkjUSeQ1MX7y2SXMTXl8Tpvu2ZTes"
                    />
                    <div className="relative z-10 flex items-center justify-between w-full bg-inverse-surface/60 px-1.5 py-0.5 rounded">
                      <span className="font-label-sm text-label-sm text-white">Odómetro</span>
                      <span className="material-symbols-outlined text-label-sm text-tertiary-fixed">check_circle</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Diagnostic Matrix & Data Consistency (5 Cols) */}
          <section className="xl:col-span-5 flex flex-col gap-4">
            {/* Algorithm Validation Matrix Card */}
            <div className="bg-surface-container-lowest rounded-xl shadow-md p-6 flex flex-col gap-4 border border-outline-variant/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-headline-sm">fact_check</span>
                  <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">Matriz de Validación Algorítmica</h2>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-label-sm text-label-sm font-bold font-mono">
                  IA SCORE: 91/100
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Comparativa estocástica entre evidencia visual procesada, parámetros RUNT y declaraciones del vendedor.
              </p>

              {/* Telemetry Checklist */}
              <div className="flex flex-col gap-3 pt-1">
                {/* Item 1 */}
                <div className="bg-surface-container-low rounded-lg p-3.5 flex flex-col gap-1 shadow-xs border border-outline-variant/20">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-tertiary-container text-body-lg">verified</span>
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">Consistencia Kilometraje vs. Odómetro</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary font-label-sm text-label-sm font-bold">
                      100% Verificado
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-outline pl-6">
                    38.400 km legibles en cluster digital. Coherencia estadística con desgaste de pedales, volante y patrón de rodamiento. Sin señales de manipulación digital.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="bg-surface-container-low rounded-lg p-3.5 flex flex-col gap-1 shadow-xs border border-outline-variant/20">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-body-lg">tune</span>
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">Simetría de Luces y Carrocería</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed-variant font-label-sm text-label-sm font-bold">
                      95% En Tolerancia
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-outline pl-6">
                    Gaps y holguras entre capó, guardabarros y faros dentro de márgenes de fábrica (2.4 mm ± 0.3 mm). Sin distorsión en soportes estructurales frontales.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="bg-surface-container-low rounded-lg p-3.5 flex flex-col gap-1 shadow-xs border border-outline-variant/20">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-secondary text-body-lg">palette</span>
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">Análisis de Tonalidad de Pintura</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-surface-variant text-primary font-label-sm text-label-sm font-bold">
                      Variación +12%
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant pl-6">
                    Detectada ligera diferencia micrométrica en guardabarros delantero derecho (+12% espesor estimado mediante espectro de brillo). <span className="text-secondary font-bold">Posible repintado preventivo</span> sin deformación de chapa interna.
                  </p>
                </div>

                {/* Item 4 */}
                <div className="bg-surface-container-low rounded-lg p-3.5 flex flex-col gap-1 shadow-xs border border-outline-variant/20">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-tertiary-container text-body-lg">handshake</span>
                      <span className="font-label-lg text-label-lg text-on-surface font-bold">Cruce con Declaración del Propietario</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary font-label-sm text-label-sm font-bold">
                      Coherente
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-outline pl-6">
                    El vendedor reportó rayón de parqueadero en 2023 atendido en taller autorizado. Los hallazgos confirman la veracidad del historial declarado.
                  </p>
                </div>
              </div>

              {/* Quick Risk Assessment Metric */}
              <div className="bg-surface-container rounded-lg p-4 flex items-center justify-between mt-1">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
                    <span className="material-symbols-outlined text-headline-sm">security</span>
                  </div>
                  <div>
                    <span className="font-label-md text-label-md text-on-surface font-bold block">Índice de Riesgo Mecánico/Estructural</span>
                    <span className="font-body-sm text-body-sm text-tertiary-container font-bold">Bajo (Apto para Negociación)</span>
                  </div>
                </div>
                <span className="font-headline-sm text-headline-sm text-primary font-bold">A-</span>
              </div>
            </div>
          </section>
        </div>

        {/* Live Event Console (Terminal Minimalista) */}
        <section className="bg-inverse-surface text-inverse-on-surface rounded-xl shadow-lg p-4 flex flex-col gap-2 font-mono border border-outline/20">
          <div className="flex items-center justify-between pb-2 border-b border-outline/20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed"></span>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline-variant pl-2">
                AutoCheck Engine v2.4 • Live Ingestion Pipeline
              </span>
            </div>
            <div className="flex items-center gap-4 text-outline-variant font-label-sm text-label-sm">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-tertiary-fixed animate-ping"></span>
                <span>LATENCIA: 142ms</span>
              </span>
              <span>GPU: T4 ACCELERATED</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 text-label-sm text-label-sm pt-1">
            <div className="flex items-center gap-2 text-outline-variant">
              <span className="text-tertiary-fixed">[14:32:01]</span>
              <span>Extrayendo metadatos EXIF de 6 imágenes de inspección...</span>
              <span className="text-tertiary-fixed font-bold">OK (Checksum verificado)</span>
            </div>
            <div className="flex items-center gap-2 text-outline-variant">
              <span className="text-tertiary-fixed">[14:32:03]</span>
              <span>Clasificando estado de componentes estructurales (Gemini Vision Multimodal API)...</span>
              <span className="text-tertiary-fixed font-bold">OK (3 hallazgos leves)</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-fixed">
              <span className="text-secondary-fixed-dim">[14:32:06]</span>
              <span>Cruzando datos con base de valores de mercado Colombia (Fasecolda / Revista Motor)...</span>
              <span className="inline-block animate-pulse text-secondary-fixed font-bold">&gt;&gt; PROCESANDO RANGO ($86M - $92M COP)</span>
            </div>
          </div>
        </section>

        {/* Bottom Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-1">
          <div className="flex items-center gap-2 text-outline font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-primary text-body-lg">info</span>
            <span>El peritaje no invasivo digital no sustituye una prueba de compresión de motor en banco estático.</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-label-lg text-label-lg transition-colors cursor-pointer border border-outline-variant/30"
              type="button"
            >
              {isPaused ? 'Reanudar Escaneo' : 'Pausar Escaneo'}
            </button>
            <button
              onClick={() => onNavigate('informe-detallado')}
              className="relative group w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-lg text-label-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 overflow-hidden cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-headline-sm">description</span>
              <span>Generar Informe Detallado de Resultados</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
