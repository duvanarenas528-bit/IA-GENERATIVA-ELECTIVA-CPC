import React, { useState } from 'react';
import { ScreenId, VehiclePartEvaluation, PartCondition } from '../types';
import { AutoCheckLogo } from '../components/AutoCheckLogo';
import { createPreperitaje, updatePreperitaje, uploadPreperitajeFoto, assetUrl } from '../services/api';
import { openReport } from '../services/navigation';

interface NuevoPreperitajeScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

const INITIAL_PARTS: VehiclePartEvaluation[] = [
  {
    id: 'lateral-der',
    name: '1. Lateral Derecho (Puertas, guardabarros y retrovisor)',
    category: 'exterior',
    condition: 'good',
    userObservations: '',
    severity: 'optima',
  },
  {
    id: 'lateral-izq',
    name: '2. Lateral Izquierdo (Puertas y costado)',
    category: 'exterior',
    condition: 'good',
    userObservations: '',
    severity: 'optima',
  },
  {
    id: 'frente-capo',
    name: '3. Frente y Capó (Parachoques, persiana y faros)',
    category: 'exterior',
    condition: 'good',
    userObservations: '',
    severity: 'optima',
  },
  {
    id: 'trasera-baul',
    name: '4. Parte Trasera y Maletero (Parachoques y compuerta)',
    category: 'exterior',
    condition: 'good',
    userObservations: '',
    severity: 'optima',
  },
  {
    id: 'techo-vidrios',
    name: '5. Techo y Cristales (Parabrisas y panorámicos)',
    category: 'exterior',
    condition: 'good',
    userObservations: '',
    severity: 'optima',
  },
  {
    id: 'vano-motor',
    name: '6. Compartimiento del Motor (Encendido y fluidos)',
    category: 'mecanica',
    condition: 'good',
    userObservations: '',
    severity: 'optima',
  },
  {
    id: 'llantas-frenos',
    name: '7. Llantas y Rines (Banda de rodadura y frenado)',
    category: 'tren_rodante',
    condition: 'good',
    userObservations: '',
    severity: 'optima',
  },
  {
    id: 'interior-odometro',
    name: '8. Interior y Odómetro (Tablero, tapicería y testigos)',
    category: 'interior',
    condition: 'good',
    userObservations: '',
    severity: 'optima',
  },
];

const PHOTO_SLOTS = [
  { slot: 'frontal', title: '01. Frontal Tres Cuartos', desc: 'Encuadre de frente y costado' },
  { slot: 'lateral', title: '02. Lateral Completo', desc: 'Perfil del vehículo' },
  { slot: 'motor', title: '03. Vano Motor', desc: 'Compartimiento mecánico' },
  { slot: 'odometro', title: '04. Odómetro y Tablero', desc: 'Lectura de kilómetros' },
  { slot: 'trasera', title: '05. Parte Trasera', desc: 'Maletero y parachoques' },
  { slot: 'interior', title: '06. Interior / Tapicería', desc: 'Asientos y consola' },
];

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const NuevoPreperitajeScreen: React.FC<NuevoPreperitajeScreenProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Vehicle Data (Step 1)
  const [plate, setPlate] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [mileage, setMileage] = useState('');
  const [color, setColor] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [transmission, setTransmission] = useState('');
  const [preperitajeId, setPreperitajeId] = useState<string | null>(null);

  // Parts Questionnaire (Step 2: El usuario nos cuenta el estado)
  const [parts, setParts] = useState<VehiclePartEvaluation[]>(INITIAL_PARTS);

  // Photo Uploads (Step 3: Guardar fotos en la plataforma)
  const [uploadedPhotos, setUploadedPhotos] = useState<{ [key: string]: string }>({});
  const [uploadingPhoto, setUploadingPhoto] = useState<{ [key: string]: boolean }>({});

  const conditionOptions: { value: PartCondition; label: string; icon: string; color: string }[] = [
    { value: 'good', label: 'En buen estado / Original', icon: 'check_circle', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
    { value: 'scratches', label: 'Rayones leves superficiales', icon: 'draw', color: 'border-amber-400 bg-amber-50 text-amber-800' },
    { value: 'dents', label: 'Golpes / Abolladuras', icon: 'handyman', color: 'border-orange-500 bg-orange-50 text-orange-800' },
    { value: 'repainted', label: 'Repintado / Descolorido', icon: 'format_paint', color: 'border-blue-500 bg-blue-50 text-blue-800' },
    { value: 'broken', label: 'Pieza rota o faltante', icon: 'warning', color: 'border-rose-500 bg-rose-50 text-rose-800' },
  ];

  const handleConditionChange = (id: string, condition: PartCondition) => {
    setParts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              condition,
              severity: condition === 'good' ? 'optima' : condition === 'scratches' ? 'baja' : condition === 'repainted' ? 'media' : 'alta',
            }
          : p
      )
    );
  };

  const handleObservationChange = (id: string, text: string) => {
    setParts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, userObservations: text } : p))
    );
  };

  const openPhotoPicker = (slot: string) => {
    document.getElementById(`photo-input-${slot}`)?.click();
  };

  const handlePhotoSelected = async (slot: string, file?: File) => {
    if (!file) return;

    if (!preperitajeId) {
      alert('Primero guarda los datos del vehículo para poder subir fotos.');
      return;
    }
    if (!ALLOWED_PHOTO_TYPES.includes(file.type)) {
      alert('Formato no válido. Solo se permiten imágenes JPG, PNG o WEBP.');
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      alert('La imagen supera el tamaño máximo de 5 MB. Elige una imagen más liviana.');
      return;
    }

    setUploadingPhoto((prev) => ({ ...prev, [slot]: true }));
    try {
      const res = await uploadPreperitajeFoto(preperitajeId, slot, file);
      setUploadedPhotos((prev) => ({
        ...prev,
        [slot]: assetUrl(res.foto.url),
      }));
    } catch (e: any) {
      alert(e.message || 'No se pudo subir la foto. Intenta nuevamente.');
    } finally {
      setUploadingPhoto((prev) => ({ ...prev, [slot]: false }));
    }
  };

  const handleGenerateReport = () => {
    if (!preperitajeId) {
      alert('Primero guarda los datos del vehículo.');
      return;
    }
    openReport(preperitajeId);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Breadcrumb & Title */}
      <section className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AutoCheckLogo size="sm" showSubtitle={false} />
              <span className="text-slate-400 text-xs">•</span>
              <span className="text-xs text-blue-700 font-bold uppercase tracking-wider">
                Nuevo Preperitaje Guiado
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Preperitaje Telemático Asistido por IA
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Cuéntanos el estado de cada parte de tu vehículo y la IA te brindará recomendaciones personalizadas.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </section>

      {/* Stepper Navigation */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs font-bold">
          {/* Step 1 */}
          <button
            onClick={() => setCurrentStep(1)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition ${
              currentStep === 1
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">1</span>
            <span>Datos del Vehículo</span>
          </button>

          <span className="text-slate-300">───</span>

          {/* Step 2 */}
          <button
            onClick={() => setCurrentStep(2)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition ${
              currentStep === 2
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">2</span>
            <span>Estado Parte por Parte (Tú nos cuentas)</span>
          </button>

          <span className="text-slate-300">───</span>

          {/* Step 3 */}
          <button
            onClick={() => setCurrentStep(3)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition ${
              currentStep === 3
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[11px]">3</span>
            <span>Fotos de Respaldo & Diagnóstico IA</span>
          </button>
        </div>
      </div>

      {/* Main Form Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* STEP 1: DATOS DEL VEHÍCULO */}
        {currentStep === 1 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-black text-slate-900">1. Identificación y Especificaciones</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ingresa los datos básicos para cotejar el kilometraje y modelo comercial en Colombia.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Placa Vehicular
                </label>
                <input
                  type="text"
                  value={plate}
                  onChange={(e) => setPlate(e.target.value.toUpperCase())}
                  placeholder="Ej. HKS-482"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono font-bold uppercase focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Marca
                </label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Ej. Renault"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Línea / Modelo
                </label>
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="Ej. Duster Dynamique"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Año Modelo
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="Ej. 2021"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Kilometraje Actual
                </label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                  placeholder="Ej. 45210"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Color
                </label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Ej. Blanco Glaciar"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tipo de Combustible
                </label>
                <select
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Gas-Gasolina">Gas / Gasolina</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Transmisión
                </label>
                <select
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="Manual 4x2">Manual (4x2)</option>
                  <option value="Automática 4x2">Automática (4x2)</option>
                  <option value="Manual 4x4">Manual (4x4)</option>
                  <option value="Automática 4x4">Automática (4x4)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={async () => {
                  const yearNum = parseInt(year);
                  const currentYear = new Date().getFullYear();
                  if (!plate) return alert('Placa requerida');
                  if (!yearNum || yearNum < 1980 || yearNum > currentYear + 1) return alert('Año inválido');
                  const mileageNum = mileage === '' ? null : parseInt(mileage);
                  if (mileage !== '' && (isNaN(mileageNum as number) || (mileageNum as number) < 0)) return alert('Kilometraje inválido');
                  try {
                    if (!preperitajeId) {
                      const res = await createPreperitaje({
                        placa: plate,
                        marca: brand,
                        linea: model,
                        anio: yearNum,
                        kilometraje: mileageNum,
                        color,
                        combustible: fuelType,
                        transmision: transmission,
                        respuestas: {},
                        estado: 'borrador',
                      });
                      setPreperitajeId(res.preperitaje.id);
                    } else {
                      await updatePreperitaje(preperitajeId, {
                        placa: plate,
                        marca: brand,
                        linea: model,
                        anio: yearNum,
                        kilometraje: mileageNum,
                        color,
                        combustible: fuelType,
                        transmision: transmission,
                      });
                    }
                  } catch (e: any) {
                    alert(e.message || 'Error al guardar');
                    return;
                  }
                  setCurrentStep(2);
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                <span>Continuar a Evaluación de Partes</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: EL USUARIO INDICA EL ESTADO PARTE POR PARTE */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-950 flex items-start gap-3 shadow-sm">
              <span className="material-symbols-outlined text-2xl text-blue-600 shrink-0 mt-0.5">
                checklist
              </span>
              <div>
                <strong className="text-sm block font-bold text-blue-900">
                  Cuéntanos el estado real de tu vehículo
                </strong>
                <p className="text-xs text-blue-800 mt-0.5 leading-relaxed">
                  Selecciona la opción que mejor describa cada parte del auto (si está bien, con rayones, golpes, repintado o roto) y usa el campo abierto para dar detalles. <strong>La IA analizará tus respuestas para darte recomendaciones preventivas y correctivas en el informe.</strong>
                </p>
              </div>
            </div>

            {/* List of parts */}
            <div className="space-y-4">
              {parts.map((part) => (
                <div
                  key={part.id}
                  className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                      {part.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Sección {part.category}
                    </span>
                  </div>

                  {/* Condition Selector Chips */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      ¿En qué estado se encuentra esta parte?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                      {conditionOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => handleConditionChange(part.id, opt.value)}
                          className={`p-3 rounded-xl border text-left font-medium transition flex items-center gap-2.5 ${
                            part.condition === opt.value
                              ? `${opt.color} font-bold shadow-sm ring-1 ring-blue-500`
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="material-symbols-outlined text-base">
                            {opt.icon}
                          </span>
                          <span className="truncate">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Open text field for specifications */}
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Especifica o añade detalles adicionales (campo abierto):
                    </label>
                    <textarea
                      rows={2}
                      value={part.userObservations}
                      onChange={(e) => handleObservationChange(part.id, e.target.value)}
                      placeholder="Ej. Tiene un leve raspón al parquear, la pintura está bien pero tiene un microrayón..."
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Step navigation buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Volver a Datos</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
              >
                <span>Continuar a Guardar Fotos</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SUBIDA DE FOTOS PARA QUE LA PÁGINA LAS GUARDE */}
        {currentStep === 3 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <AutoCheckLogo size="sm" showSubtitle={false} />
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                  Paso Final: Almacenamiento
                </span>
              </div>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                3. Fotos de Respaldo del Vehículo
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Sube las fotos de tu vehículo para que la plataforma las guarde en tu ficha técnica, en el informe para el comprador y en tu certificado.
              </p>
            </div>

            {/* Photo Slots Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PHOTO_SLOTS.map((item) => {
                const isUploading = !!uploadingPhoto[item.slot];
                const hasPhoto = !!uploadedPhotos[item.slot];

                return (
                  <div
                    key={item.slot}
                    className="border border-slate-200 rounded-2xl p-3 bg-slate-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <strong className="text-slate-800">{item.title}</strong>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          hasPhoto
                            ? 'text-emerald-600 bg-emerald-50'
                            : 'text-slate-500 bg-slate-100'
                        }`}
                      >
                        {hasPhoto ? 'Guardada' : 'Pendiente'}
                      </span>
                    </div>

                    <input
                      id={`photo-input-${item.slot}`}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        handlePhotoSelected(item.slot, file);
                        e.target.value = '';
                      }}
                    />

                    <div
                      className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 relative group"
                      onClick={() => openPhotoPicker(item.slot)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') openPhotoPicker(item.slot);
                      }}
                    >
                      {hasPhoto ? (
                        <img
                          src={uploadedPhotos[item.slot]}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1">
                          <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                          <span className="text-[11px] font-semibold">Sin foto</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openPhotoPicker(item.slot);
                          }}
                          disabled={isUploading}
                          className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow"
                        >
                          {isUploading ? 'Subiendo...' : hasPhoto ? 'Cambiar Foto' : 'Subir Foto'}
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500">{item.desc}</p>
                  </div>
                );
              })}
            </div>

            {/* AI Recommendation Preview Banner */}
            <div className="p-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-400">psychology</span>
                <strong className="text-sm">Generación de Recomendaciones con IA</strong>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Al hacer clic en generar, la IA procesará las respuestas que diste en cada una de las 8 partes del vehículo y las fotos guardadas para entregarte un informe detallado con:
                <br />• <strong>Sugerencias preventivas y de mantenimiento</strong> según las partes que indicaste con golpes o rayones.
                <br />• <strong>Resumen de las partes buenas</strong> para destacar ante futuros compradores.
                <br />• <strong>Ficha de control de cambio de aceite y llantas</strong> lista para transferir al nuevo dueño.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                <span>Modificar Respuestas</span>
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    if (preperitajeId) {
                      await updatePreperitaje(preperitajeId, {
                        estado: 'completado',
                        respuestas: parts,
                      });
                    }
                  } catch (e: any) {
                    alert(e.message || 'Error al guardar');
                    return;
                  }
                  handleGenerateReport();
                }}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                <span>Generar Informe y Recomendaciones con IA</span>
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
