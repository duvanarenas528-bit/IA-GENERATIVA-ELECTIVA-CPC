import React, { useState } from 'react';
import { ScreenId } from '../types';

interface GuiaInspeccionScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

interface AngleGuide {
  id: string;
  title: string;
  badge: string;
  distance: string;
  height: string;
  description: string;
  goodImage: string;
  badImage: string;
  goodReason: string;
  badReason: string;
  keyPoints: string[];
}

export const GuiaInspeccionScreen: React.FC<GuiaInspeccionScreenProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'angles' | 'lighting' | 'checklist' | 'faq'>('angles');
  const [selectedAngle, setSelectedAngle] = useState<number>(0);

  const angleGuides: AngleGuide[] = [
    {
      id: 'frontal-34',
      title: '01. Frontal Tres Cuartos (3/4)',
      badge: 'Ángulo Crítico de Estructura',
      distance: '2.5 a 3.0 metros',
      height: 'A la altura del faro delantero (~90 cm)',
      description: 'Permite al modelo de Gemini Vision evaluar la simetría de ópticas, separación de juntas entre capó y guardabarros, y el estado de la parrilla frontal y paragolpes.',
      goodImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=600&q=80',
      badImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80',
      goodReason: 'Vehículo completo en encuadre, iluminación uniforme, sombras mínimas y ruedas rectas.',
      badReason: 'Encuadre recortado, sombras profundas que ocultan deformaciones de lámina y contraluz severo.',
      keyPoints: [
        'Asegúrate de que ambas esquinas frontales y el costado lateral sean visibles.',
        'Las ruedas deben estar en posición recta hacia el frente.',
        'Evita tomar la foto a menos de 2 metros para evitar distorsión de lente gran angular.'
      ]
    },
    {
      id: 'lateral-completo',
      title: '02. Perfil Lateral Completo',
      badge: 'Alineación de Puertas & Zócalos',
      distance: '3.5 a 4.0 metros',
      height: 'A la altura de las manijas de puertas (~100 cm)',
      description: 'Crucial para detectar desalineaciones entre paneles (gap analysis), repintados con texturas piel de naranja y ondulaciones en zócalos inferiores.',
      goodImage: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=600&q=80',
      badImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
      goodReason: 'Línea de horizonte recta paralela al vehículo, reflejos uniformes para análisis de barniz.',
      badReason: 'Ángulo cenital o demasiado bajo que oculta el panel de zócalo inferior y genera reflejos falsos.',
      keyPoints: [
        'Verifica que el parachoques delantero y trasero queden dentro del margen de la foto.',
        'La cámara debe estar perfectamente perpendicular al centro de las dos puertas.',
        'Limpia la lente de tu smartphone para evitar destellos o halos de luz.'
      ]
    },
    {
      id: 'vano-motor',
      title: '03. Vano Motor & Compartimiento',
      badge: 'Inspección Mecánica & Torretas',
      distance: '0.8 a 1.2 metros',
      height: 'Cenital a 45 grados sobre el motor',
      description: 'Permite al algoritmo verificar el estado de las torretas de suspensión, soldaduras originales de fábrica, fugas visibles de aceite y estado de bandas y mangueras.',
      goodImage: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80',
      badImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
      goodReason: 'Flash difuso o luz diurna natural, ambas copelas de amortiguador visibles, foco nítido.',
      badReason: 'Foto tomada en garaje oscuro sin luz auxiliar, zonas quemadas por flash directo.',
      keyPoints: [
        'Abre el capó y asegúralo firmemente con la varilla o amortiguador.',
        'Toma la foto con el motor apagado y frío.',
        'Asegúrate de que las placas de identificación y número de chasis troquelado no queden tapadas.'
      ]
    },
    {
      id: 'odometro-tablero',
      title: '04. Odómetro & Testigos de Tablero',
      badge: 'Validación de Kilometraje & ECM',
      distance: '40 a 60 centímetros',
      height: 'Frente al cuadro de instrumentos con switch en posición ON',
      description: 'Se ejecuta OCR neuronal para extraer la lectura exacta de kilómetros y se valida la presencia o ausencia de testigos de advertencia (Check Engine, Airbag, ABS).',
      goodImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80',
      badImage: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=600&q=80',
      goodReason: 'Dígitos del odómetro perfectamente legibles, sin reflejos de flash en el policarbonato.',
      badReason: 'Movimiento desenfocado, reflejo directo del sol sobre el cristal que tapa el kilometraje.',
      keyPoints: [
        'Gira la llave a posición de contacto (IGNITION ON) para encender la pantalla digital.',
        'No uses flash directo sobre la carátula de acrílico para evitar reflejos blanquecinos.',
        'El volante debe estar centrado para no tapar los números con los radios.'
      ]
    },
    {
      id: 'tren-neumaticos',
      title: '05. Neumáticos & Profundidad de Huella',
      badge: 'Seguridad Activa & Desgaste',
      distance: '30 a 50 centímetros',
      height: 'Nivel del suelo con la dirección girada 45°',
      description: 'Determina el patrón de desgaste (asimétrico, central o en bordes) y estima el remanente de surco respecto al límite legal de 1.6 mm.',
      goodImage: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=600&q=80',
      badImage: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80',
      goodReason: 'Surcos principales iluminados, código DOT de fabricación visible en el flanco exterior.',
      badReason: 'Rueda sucia de barro espeso que tapa los indicadores TWI (Tread Wear Indicator).',
      keyPoints: [
        'Gira el volante para exponer la banda de rodadura hacia afuera.',
        'Retira piedras o lodo que puedan ocultar grietas en los canales.',
        'Fotografía al menos las 2 llantas delanteras y 1 trasera.'
      ]
    }
  ];

  const currentAngle = angleGuides[selectedAngle];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Banner */}
      <section className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white px-4 sm:px-6 lg:px-8 py-10 border-b border-indigo-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-blue-500/20 text-blue-300 text-xs font-bold px-2.5 py-1 rounded border border-blue-400/30 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">menu_book</span>
                  Protocolo Técnico Oficial UNIMINUTO
                </span>
                <span className="text-xs text-indigo-300 font-mono">Norma NTC-5375</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Guía Fotogramétrica para Peritaje con IA
              </h1>
              <p className="mt-2 text-sm text-slate-300 max-w-2xl">
                Aprende cómo capturar cada ángulo y detalle vehicular para que los modelos de visión artificial y Gemini Vision alcancen más del 98% de precisión diagnóstica.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('nuevo-preperitaje')}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-emerald-500/20 transition transform active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">add_a_photo</span>
                Iniciar Preperitaje Ahora
              </button>
            </div>
          </div>

          {/* Navigation Sub-tabs */}
          <div className="mt-8 flex gap-2 border-b border-indigo-800/60 pb-px overflow-x-auto">
            <button
              onClick={() => setActiveTab('angles')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'angles'
                  ? 'bg-white text-blue-900 shadow'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-base">photo_camera</span>
              Ángulos de Captura Canónicos
            </button>
            <button
              onClick={() => setActiveTab('lighting')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'lighting'
                  ? 'bg-white text-blue-900 shadow'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-base">wb_sunny</span>
              Iluminación & Entorno
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'checklist'
                  ? 'bg-white text-blue-900 shadow'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-base">checklist</span>
              Checklist Previo al Escaneo
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'faq'
                  ? 'bg-white text-blue-900 shadow'
                  : 'text-indigo-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-base">help</span>
              Preguntas Frecuentes
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {activeTab === 'angles' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Angle Selector List */}
            <div className="lg:col-span-4 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
                Puntos de Inspección Clave
              </h2>
              {angleGuides.map((guide, idx) => (
                <button
                  key={guide.id}
                  onClick={() => setSelectedAngle(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-start gap-3 ${
                    selectedAngle === idx
                      ? 'bg-blue-50/80 border-blue-500 shadow-sm text-blue-950'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      selectedAngle === idx
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold truncate">{guide.title}</h4>
                      {selectedAngle === idx && (
                        <span className="material-symbols-outlined text-sm text-blue-600">chevron_right</span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                      {guide.badge}
                    </span>
                  </div>
                </button>
              ))}

              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <span className="material-symbols-outlined text-base text-amber-600">lightbulb</span>
                  Consejo de Calidad
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Si un ángulo no supera el umbral de nitidez del 85%, el sistema te solicitará repetir la toma antes de iniciar la inferencia.
                </p>
              </div>
            </div>

            {/* Right Column: Angle Deep Dive & Comparison */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                {/* Header details */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
                      {currentAngle.badge}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                      {currentAngle.title}
                    </h3>
                  </div>

                  <div className="flex gap-2">
                    <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Distancia</span>
                      <strong className="text-slate-700">{currentAngle.distance}</strong>
                    </div>
                    <div className="bg-slate-100 px-3 py-1.5 rounded-lg text-xs">
                      <span className="text-slate-400 block text-[9px] uppercase font-bold">Altura</span>
                      <strong className="text-slate-700">{currentAngle.height}</strong>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-slate-600 my-4 leading-relaxed">
                  {currentAngle.description}
                </p>

                {/* Good vs Bad Visual Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                  {/* Correct Photo */}
                  <div className="border-2 border-emerald-500 rounded-xl p-3 bg-emerald-50/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-emerald-600">check_circle</span>
                        TOMA CORRECTA
                      </span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Score IA: 98%
                      </span>
                    </div>

                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 relative">
                      <img
                        src={currentAngle.goodImage}
                        alt="Ejemplo correcto"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white text-[11px]">
                        {currentAngle.goodReason}
                      </div>
                    </div>
                  </div>

                  {/* Incorrect Photo */}
                  <div className="border-2 border-rose-300 rounded-xl p-3 bg-rose-50/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-rose-800 flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm text-rose-600">cancel</span>
                        TOMA INCORRECTA (A RECHAZAR)
                      </span>
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded">
                        Score IA: 42%
                      </span>
                    </div>

                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-slate-100 relative">
                      <img
                        src={currentAngle.badImage}
                        alt="Ejemplo incorrecto"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white text-[11px]">
                        {currentAngle.badReason}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Points Checklist */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-blue-600">task_alt</span>
                    Recomendaciones Específicas para esta Toma
                  </h4>
                  <ul className="space-y-1.5">
                    {currentAngle.keyPoints.map((pt, pIdx) => (
                      <li key={pIdx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lighting' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Condiciones de Luz y Ubicación Óptima</h2>
              <p className="text-xs text-slate-500 mt-1">
                La visión por computadora requiere contraste claro para segmentar microarañazos y desalineaciones milimétricas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">cloud</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Días Nublados o Sombra Abierta</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Es la mejor condición posible. La luz difusa evita brillos cegadores sobre la pintura metalizada y permite a la IA mapear el espesor de capa sin ruido.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="w-10 h-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">sunny</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Evita Sol de Mediodía Directo</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  El sol perpendicular genera reflejos especulares que pueden confundirse con abolladuras o repintados. Si es mediodía, busca un área techada bien iluminada.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-xl">cleaning_services</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Vehículo Limpio y Seco</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Polvo denso, barro o gotas de lluvia secas pueden ocultar defectos reales o arrojar falsos positivos de fisuras en las capas de laca.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Checklist Pre-Inspección (10 Pasos)</h2>
              <p className="text-xs text-slate-500 mt-1">
                Asegura estas condiciones antes de comenzar a cargar fotografías al sistema.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { title: 'Vehículo estacionado en superficie plana y horizontal', desc: 'Permite evaluar la caída de suspensión y la altura simétrica de amortiguadores.' },
                { title: 'Espacio mínimo de 3 metros despejado en los 4 costados', desc: 'Necesario para encuadrar las fotos completas sin cortes.' },
                { title: 'Lente de la cámara limpia con paño de microfibra', desc: 'Evita halos de grasa que nublen las lecturas del odómetro y cristales.' },
                { title: 'Ruedas delanteras perfectamente alineadas hacia adelante', desc: 'Facilita la verificación del radio de giro y holgura de guardabarros.' },
                { title: 'Documento de propiedad / Tarjeta de matrícula a mano', desc: 'Para corroborar número de motor, VIN y datos del propietario.' },
                { title: 'Motor apagado con llave en posición contacto (ON)', desc: 'Para capturar los testigos encendidos del cuadro de instrumentos.' },
                { title: 'Capó y maletero desasegurados listos para abrir', desc: 'Agiliza las tomas de copelas de suspensión y piso de rueda de repuesto.' },
                { title: 'Buena conexión a internet (4G / 5G / Wi-Fi)', desc: 'Para la transmisión en alta definición de las imágenes hacia Gemini Vision.' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                  <div className="w-6 h-6 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Preguntas Frecuentes Técnicas</h2>
              <p className="text-xs text-slate-500 mt-1">
                Respuestas sobre la fiabilidad de la visión artificial y el valor legal del informe.
              </p>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="text-xs font-bold text-slate-900">¿Reemplaza este informe a un peritaje físico tradicional?</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Es un <strong>preperitaje telemático preliminar</strong>. Filtra con 98.4% de efectividad vehículos con siniestros graves, repintados masivos o adulteraciones de odómetro antes de incurrir en costos de traslado o inspección en taller físico.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="text-xs font-bold text-slate-900">¿Cómo detecta la IA el espesor de la pintura en micrómetros (µm)?</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  A través de fotometría superficial multimodal y redes convolucionales entrenadas en más de 200.000 paneles de carrocería. La IA analiza el grado de refracción, textura de piel de naranja y desvanecimiento de color con los paneles adyacentes.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="text-xs font-bold text-slate-900">¿Qué validez tiene el código SHA-256 del certificado?</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Garantiza la inmutabilidad forense del reporte. Cualquier alteración de un solo píxel o número en el documento invalidará el hash ante aseguradoras y entidades financieras.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
