import React, { useState } from 'react';
import { ScreenId, MaintenanceItem } from '../types';
import { AutoCheckLogo } from '../components/AutoCheckLogo';
import { useAuth } from '../context/AuthContext';
import { useVehicles } from '../context/VehicleContext';

interface FichaVentaScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const FichaVentaScreen: React.FC<FichaVentaScreenProps> = ({ onNavigate }) => {
  const { user, loginWithEmail } = useAuth();
  const {
    selectedVehicle,
    transferVehicle,
    addMaintenanceToVehicle,
    resetDefaultVehicles,
  } = useVehicles();

  const [viewMode, setViewMode] = useState<'seller' | 'buyer'>('seller');
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState<boolean>(false);

  // In-app transfer form state
  const [buyerEmail, setBuyerEmail] = useState<string>('duban.tibaquira@uniminuto.edu.co');
  const [transferNotes, setTransferNotes] = useState<string>('Traspaso por compraventa acordada. Entrega con 2 llaves y carpeta de mantenimientos al día.');
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [transferResult, setTransferResult] = useState<{
    success: boolean;
    folio?: string;
    buyerEmail?: string;
    error?: string;
  } | null>(null);

  // Maintenance form state
  const [newType, setNewType] = useState<MaintenanceItem['type']>('aceite');
  const [newTitle, setNewTitle] = useState('Cambio de Aceite Sintético y Filtro');
  const [newDate, setNewDate] = useState('24 de Octubre, 2026');
  const [newMileage, setNewMileage] = useState('47000');
  const [newDetails, setNewDetails] = useState('');
  const [newWorkshop, setNewWorkshop] = useState('');

  if (!selectedVehicle) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <AutoCheckLogo size="lg" className="mb-4" />
        <h2 className="text-xl font-bold text-slate-800">No hay vehículo seleccionado</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          No tienes vehículos activos en este momento o ya fueron transferidos a sus nuevos dueños.
        </p>
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Ir al Panel Principal
          </button>
          <button
            onClick={resetDefaultVehicles}
            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl text-xs font-bold"
          >
            Restablecer Vehículo de Prueba
          </button>
        </div>
      </div>
    );
  }

  const currentUserEmail = (user?.email || 'lenimur03@gmail.com').toLowerCase();
  const vehicleOwnerEmail = selectedVehicle.ownerEmail.toLowerCase();
  const isOwner = currentUserEmail === vehicleOwnerEmail;

  // Handle in-app ownership transfer
  const handleExecuteTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsTransferring(true);
    setTransferResult(null);

    const res = await transferVehicle(selectedVehicle.id, buyerEmail);
    setIsTransferring(false);

    if (res.success) {
      setTransferResult({
        success: true,
        folio: res.transferFolio,
        buyerEmail,
      });
    } else {
      setTransferResult({
        success: false,
        error: res.error || 'Error al procesar el traspaso',
      });
    }
  };

  // Switch to the buyer's account immediately to demonstrate the transfer
  const handleSimulateLoginAsBuyer = async () => {
    if (transferResult?.buyerEmail) {
      await loginWithEmail(transferResult.buyerEmail, '123456');
      setShowTransferModal(false);
      setTransferResult(null);
    }
  };

  // Add maintenance
  const handleAddMaintenance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newMileage) return;

    addMaintenanceToVehicle(selectedVehicle.id, {
      type: newType,
      title: newTitle,
      lastDate: newDate || 'Hoy',
      lastMileage: Number(newMileage),
      nextRecommendedMileage: Number(newMileage) + (newType === 'aceite' ? 5000 : 10000),
      details: newDetails || 'Mantenimiento preventivo registrado.',
      status: 'al_dia',
      workshop: newWorkshop || 'Taller Autorizado',
    });

    setShowAddMaintenanceModal(false);
    setNewDetails('');
    setNewWorkshop('');
  };

  const currentVehicleKm = selectedVehicle.mileage;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Header Banner */}
      <header className="bg-slate-900 border-b border-slate-800 text-white px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <AutoCheckLogo
              size="lg"
              variant="white"
              subtitleText="PASSPORT VEHICULAR DE VENTA"
              onClick={() => onNavigate('dashboard')}
            />
            <div className="hidden sm:block h-8 w-px bg-slate-700"></div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-700/60 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                {isOwner ? 'Eres el Propietario Actual' : `Propiedad de ${selectedVehicle.ownerEmail}`}
              </span>
              <h1 className="text-sm font-bold text-slate-200 mt-0.5">
                {selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.year}) • Placa {selectedVehicle.plate}
              </h1>
            </div>
          </div>

          {/* Action Buttons: 1. Compartir Ficha, 2. Traspasar Vehículo al Comprador */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* View Mode Switcher */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('seller')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'seller'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">edit_note</span>
                Modo Gestión
              </button>
              <button
                onClick={() => setViewMode('buyer')}
                className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                  viewMode === 'buyer'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-sm">visibility</span>
                Vista Comprador
              </button>
            </div>

            {/* BOTÓN 1: Compartir datos para que el futuro comprador los vea */}
            <button
              onClick={() => setShowShareModal(true)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              title="Compartir link o QR para que el comprador examine el estado"
            >
              <span className="material-symbols-outlined text-base text-blue-400">share</span>
              <span>1. Compartir Ficha</span>
            </button>

            {/* BOTÓN 2: Traspasar vehículo internamente al nuevo dueño */}
            <button
              onClick={() => {
                setTransferResult(null);
                setShowTransferModal(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center gap-1.5 active:scale-95"
              title="Transferir la propiedad del vehículo directamente por correo en la app"
            >
              <span className="material-symbols-outlined text-base">forward_to_inbox</span>
              <span>2. Traspasar a Nuevo Dueño</span>
            </button>

            <button
              onClick={() => onNavigate('visor-a4')}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition"
              title="Descargar documento A4"
            >
              <span className="material-symbols-outlined text-base">print</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">

        {/* Ownership Notice Bar */}
        {selectedVehicle.transferredAt && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-blue-950 flex items-start gap-3 shadow-sm">
            <span className="material-symbols-outlined text-2xl text-blue-600 shrink-0 mt-0.5">
              assignment_turned_in
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <strong className="text-sm font-bold text-blue-900">
                  Historial de Traspaso In-App Registrado
                </strong>
                <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                  FOLIO: {selectedVehicle.transferFolio || 'TRASP-2026-90214'}
                </span>
              </div>
              <p className="text-xs text-blue-800 mt-1 leading-relaxed">
                Este vehículo fue transferido formalmente a <strong>{selectedVehicle.ownerEmail}</strong> el {selectedVehicle.transferredAt}. Como nuevo propietario, puede actualizar kilometrajes, añadir mantenimientos preventivos o volver a transferirlo cuando lo venda en el futuro.
              </p>
            </div>
          </div>
        )}

        {/* Hero Card: Vehicle Summary & Owner Control */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Photo Preview */}
          <div className="lg:col-span-5 space-y-3">
            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 relative shadow-inner">
              <img
                src={selectedVehicle.image}
                alt={selectedVehicle.model}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur text-white px-2.5 py-1 rounded-lg text-xs font-bold font-mono">
                PLACA: {selectedVehicle.plate}
              </div>
              <div className="absolute bottom-3 right-3 bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider shadow">
                Score IA: {selectedVehicle.score}/100
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span>Propietario registrado: <strong className="text-slate-800">{selectedVehicle.ownerEmail}</strong></span>
              <span className="text-emerald-700 font-bold">● Activo en Garaje</span>
            </div>
          </div>

          {/* Details & Specs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Ficha de Traspaso & Control In-App
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {selectedVehicle.brand} {selectedVehicle.model}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Modelo {selectedVehicle.year} • Color {selectedVehicle.color} • Historial Verificado
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-2xl text-center">
                <span className="text-[10px] font-bold text-blue-900 uppercase block">Kilometraje Actual</span>
                <span className="text-xl font-black text-blue-700 font-mono">
                  {selectedVehicle.mileage.toLocaleString()} km
                </span>
              </div>
            </div>

            {/* Highlights Grid for Buyers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">SOAT & Tecnomecánica</span>
                <strong className="text-emerald-700 font-bold block mt-0.5">Vigente Nov 2026</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Siniestros Fasecolda</span>
                <strong className="text-emerald-700 font-bold block mt-0.5">0 Reclamaciones</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">RUNT / Traspasos</span>
                <strong className="text-emerald-700 font-bold block mt-0.5">Listo para Traspaso</strong>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Tasación IA Sugerida</span>
                <strong className="text-slate-900 font-bold block mt-0.5">$55.800.000 COP</strong>
              </div>
            </div>

            {/* In-App Transfer Prompt Banner */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <strong className="text-emerald-950 text-xs block">
                  ¿Vendiste este auto o estás por cerrar el negocio?
                </strong>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  Usa la transferencia interna para pasárselo a la cuenta del nuevo dueño con todo su historial.
                </p>
              </div>

              <button
                onClick={() => {
                  setTransferResult(null);
                  setShowTransferModal(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center gap-1.5 shrink-0"
              >
                <span className="material-symbols-outlined text-sm">forward_to_inbox</span>
                Transferir Vehículo Ahora
              </button>
            </div>

          </div>
        </div>

        {/* Section 2: THE CRITICAL BUYER'S MAINTENANCE CHECKLIST */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <AutoCheckLogo size="sm" showSubtitle={false} />
                <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">
                  Historial de Mantenimientos para el Comprador
                </span>
              </div>
              <h3 className="text-xl font-black text-slate-900 mt-1">
                ¿Cuándo fue el último cambio de aceite, llantas y frenos?
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Historial documentado que el nuevo propietario heredará y podrá seguir actualizando.
              </p>
            </div>

            {/* Button to add new maintenance */}
            <button
              onClick={() => setShowAddMaintenanceModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 self-start sm:self-center"
            >
              <span className="material-symbols-outlined text-base">add</span>
              Registrar Nuevo Mantenimiento
            </button>
          </div>

          {/* Maintenance Items Detailed List */}
          <div className="space-y-4">
            {selectedVehicle.maintenance.map((item) => {
              const kmSinceLast = currentVehicleKm - item.lastMileage;
              const kmUntilNext = item.nextRecommendedMileage
                ? item.nextRecommendedMileage - currentVehicleKm
                : null;

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 transition shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${
                          item.type === 'aceite'
                            ? 'bg-amber-600'
                            : item.type === 'llantas'
                            ? 'bg-slate-800'
                            : item.type === 'frenos'
                            ? 'bg-rose-600'
                            : item.type === 'correa'
                            ? 'bg-indigo-600'
                            : 'bg-emerald-600'
                        }`}
                      >
                        <span className="material-symbols-outlined text-xl">
                          {item.type === 'aceite'
                            ? 'oil_barrel'
                            : item.type === 'llantas'
                            ? 'tire_repair'
                            : item.type === 'frenos'
                            ? 'front_hand'
                            : item.type === 'correa'
                            ? 'sync'
                            : 'battery_charging_full'}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                        <span className="text-[11px] text-slate-500">
                          Taller: <strong>{item.workshop}</strong> • Registrado el {item.lastDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center">
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">verified</span>
                        Al Día
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-xl border border-slate-100">
                    {item.details}
                  </p>

                  {/* Mileage progress comparison for buyer */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Realizado a los
                      </span>
                      <strong className="text-slate-900 font-mono text-sm">
                        {item.lastMileage.toLocaleString()} km
                      </strong>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Kilómetros recorridos desde el cambio
                      </span>
                      <strong className="text-blue-700 font-mono text-sm">
                        +{kmSinceLast >= 0 ? kmSinceLast.toLocaleString() : 0} km
                      </strong>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Próximo cambio sugerido
                      </span>
                      <strong className="text-emerald-700 font-mono text-sm">
                        {item.nextRecommendedMileage
                          ? `${item.nextRecommendedMileage.toLocaleString()} km (en ${kmUntilNext?.toLocaleString()} km)`
                          : 'Revisión periódica'}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* MODAL 1: Compartir Ficha con Comprador (Link / QR) */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">share</span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">Compartir Ficha con Comprador</h3>
            <p className="text-xs text-slate-500">
              Envía este enlace o código QR al interesado para que revise las fotos, el estado y el historial de aceite y llantas.
            </p>

            <div className="bg-slate-100 p-4 rounded-2xl inline-block shadow-inner">
              <span className="material-symbols-outlined text-7xl text-slate-900">qr_code_2</span>
            </div>

            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl text-xs font-mono text-slate-700 break-all select-all">
              https://autocheck.ai/pass/{selectedVehicle.plate}-2026
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`https://autocheck.ai/pass/${selectedVehicle.plate}-2026`);
                  alert('¡Enlace copiado al portapapeles!');
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition"
              >
                Copiar Enlace
              </button>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: TRASPASO INTERNO DEL VEHÍCULO AL COMPRADOR (IN-APP TRANSFER) */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AutoCheckLogo size="sm" showSubtitle={false} />
                <h3 className="text-base font-black text-slate-900">
                  Traspasar Vehículo a Nuevo Dueño
                </h3>
              </div>
              <button
                onClick={() => setShowTransferModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {transferResult?.success ? (
              // Success view with transfer receipt and 1-click test simulation
              <div className="text-center space-y-4 py-2">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>

                <div>
                  <h4 className="text-lg font-black text-slate-900">
                    ¡Vehículo Traspasado con Éxito!
                  </h4>
                  <p className="text-xs text-slate-600 mt-1">
                    El <strong>{selectedVehicle.brand} {selectedVehicle.model} ({selectedVehicle.plate})</strong> ha sido transferido a la cuenta de:
                  </p>
                  <span className="inline-block mt-2 font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-lg text-xs">
                    {transferResult.buyerEmail}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-1 text-slate-600 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span>Folio Digital:</span>
                    <strong className="text-slate-900">{transferResult.folio}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Estado en tu cuenta:</span>
                    <span className="text-amber-700 font-bold">Transferido (Retirado de tu garaje)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nuevo control:</span>
                    <span className="text-emerald-700 font-bold">Habilitado para el comprador</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  El nuevo dueño ahora puede continuar registrando cambios de aceite, llantas y transferirlo en el futuro si decide venderlo.
                </p>

                {/* 1-Click Simulation Button to verify as buyer */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={handleSimulateLoginAsBuyer}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-base">switch_account</span>
                    <span>Probar: Entrar como el Nuevo Dueño ({transferResult.buyerEmail})</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowTransferModal(false);
                      onNavigate('dashboard');
                    }}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
                  >
                    Ir a Mi Panel de Control
                  </button>
                </div>
              </div>
            ) : (
              // Transfer input form
              <form onSubmit={handleExecuteTransfer} className="space-y-4 text-xs">
                {transferResult?.error && (
                  <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-rose-600">error</span>
                    <span>{transferResult.error}</span>
                  </div>
                )}

                <div className="p-3.5 bg-amber-50/80 border border-amber-300 rounded-2xl text-amber-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    <span className="material-symbols-outlined text-amber-700 text-base">warning</span>
                    <span>Importante: Traspaso de Propiedad en la App</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Al confirmar, este vehículo saldrá de tu cuenta activa y pasará a ser administrado por el nuevo comprador. El nuevo dueño podrá seguir cargando sus mantenimientos y transferirlo en un futuro si lo vende.
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Correo del Nuevo Comprador / Propietario
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-400 text-base">
                      alternate_email
                    </span>
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="correo.comprador@ejemplo.com"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Sugerencias para pruebas: <strong>duban.tibaquira@uniminuto.edu.co</strong> o <strong>comprador.nuevo@gmail.com</strong>
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Observaciones o Nota de Entrega
                  </label>
                  <textarea
                    rows={3}
                    value={transferNotes}
                    onChange={(e) => setTransferNotes(e.target.value)}
                    placeholder="Ej. Traspaso acordado por compraventa. Vehículo entregado con llave duplicada..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={isTransferring}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    {isTransferring ? (
                      <>
                        <span className="material-symbols-outlined text-base animate-spin">refresh</span>
                        <span>Transfiriendo vehículo...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-base">forward_to_inbox</span>
                        <span>Confirmar y Traspasar Vehículo</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowTransferModal(false)}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* MODAL 3: Registrar Mantenimiento (para vendedor o nuevo dueño) */}
      {showAddMaintenanceModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <AutoCheckLogo size="sm" showSubtitle={false} />
                <h3 className="text-base font-bold text-slate-900">Registrar Mantenimiento</h3>
              </div>
              <button
                onClick={() => setShowAddMaintenanceModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddMaintenance} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tipo de Mantenimiento
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => {
                      setNewType(e.target.value as any);
                      if (e.target.value === 'aceite') setNewTitle('Cambio de Aceite Sintético y Filtro');
                      if (e.target.value === 'llantas') setNewTitle('Cambio / Rotación de Llantas');
                      if (e.target.value === 'frenos') setNewTitle('Pastillas de Freno');
                      if (e.target.value === 'bateria') setNewTitle('Cambio de Batería');
                      if (e.target.value === 'correa') setNewTitle('Correa de Repartición');
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="aceite">🛢️ Cambio de Aceite & Filtro</option>
                    <option value="llantas">🛞 Llantas & Alineación</option>
                    <option value="frenos">🛑 Pastillas / Discos de Freno</option>
                    <option value="correa">⚙️ Correa de Repartición</option>
                    <option value="bateria">🔋 Batería & Sistema Eléctrico</option>
                    <option value="suspension">🔩 Suspensión / Amortiguadores</option>
                    <option value="otro">🔧 Otro Mantenimiento</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kilometraje al momento
                  </label>
                  <input
                    type="number"
                    required
                    value={newMileage}
                    onChange={(e) => setNewMileage(e.target.value)}
                    placeholder="Ej. 47000"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Título del Registro
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej. Cambio de Aceite 10W-40 y Filtros"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Fecha
                  </label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="Ej. 24 de Octubre, 2026"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Taller o Centro de Servicio
                  </label>
                  <input
                    type="text"
                    value={newWorkshop}
                    onChange={(e) => setNewWorkshop(e.target.value)}
                    placeholder="Ej. Serviteca Los Andes"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Detalles del Mantenimiento
                </label>
                <textarea
                  rows={3}
                  value={newDetails}
                  onChange={(e) => setNewDetails(e.target.value)}
                  placeholder="Especifica marca de repuestos, viscosidad, garantía, etc."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition"
                >
                  Guardar en el Historial
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddMaintenanceModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
