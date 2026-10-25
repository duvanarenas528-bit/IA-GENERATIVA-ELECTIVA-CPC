import React, { createContext, useContext, useState, useEffect } from 'react';
import { MaintenanceItem, VehiclePartEvaluation } from '../types';
import { useAuth } from './AuthContext';

export interface VehicleRecord {
  id: string;
  plate: string;
  brand: string;
  model: string;
  year: number;
  mileage: number;
  color: string;
  score: number;
  image: string;
  ownerEmail: string;
  transferredTo?: string;
  transferredAt?: string;
  transferFolio?: string;
  maintenance: MaintenanceItem[];
  parts: VehiclePartEvaluation[];
}

interface VehicleContextType {
  vehicles: VehicleRecord[];
  myActiveVehicles: VehicleRecord[];
  myTransferredVehicles: VehicleRecord[];
  selectedVehicle: VehicleRecord | null;
  setSelectedVehicle: (v: VehicleRecord | null) => void;
  transferVehicle: (vehicleId: string, buyerEmail: string) => Promise<{ success: boolean; transferFolio?: string; error?: string }>;
  addMaintenanceToVehicle: (vehicleId: string, item: Omit<MaintenanceItem, 'id'>) => void;
  resetDefaultVehicles: () => void;
}

const initialVehicles: VehicleRecord[] = [
  {
    id: 'veh_duster_01',
    plate: 'HKS-482',
    brand: 'Renault',
    model: 'Duster 1.6 Dynamique 4x2',
    year: 2021,
    mileage: 45210,
    color: 'Blanco Glaciar',
    score: 88,
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
    ownerEmail: 'lenimur03@gmail.com',
    maintenance: [
      {
        id: 'm1',
        type: 'aceite',
        title: 'Cambio de Aceite Sintético y Filtro',
        lastDate: '15 de Mayo, 2026',
        lastMileage: 42000,
        nextRecommendedMileage: 47000,
        nextRecommendedDate: '15 de Noviembre, 2026',
        details: 'Aceite Motul 8100 X-cess 5W-40 100% sintético. Se reemplazó filtro de aceite y filtro de aire de motor.',
        status: 'al_dia',
        workshop: 'Renault Minuto - Calle 127, Bogotá',
      },
      {
        id: 'm2',
        type: 'llantas',
        title: 'Juego de Llantas y Alineación 3D',
        lastDate: '12 de Enero, 2026',
        lastMileage: 38500,
        nextRecommendedMileage: 48500,
        details: '4 neumáticos Michelin Primacy 4 (215/65 R16). Labrado actual medido: 5.2 mm (Vida útil restante ~65%). Balanceo y rotación realizados.',
        status: 'al_dia',
        workshop: 'Serviteca Goodyear Norte',
      },
      {
        id: 'm3',
        type: 'frenos',
        title: 'Pastillas de Freno Delanteras',
        lastDate: '20 de Marzo, 2026',
        lastMileage: 40200,
        nextRecommendedMileage: 60000,
        details: 'Pastillas cerámicas marca Bosch al 85% de grosor útil. Discos ventilados verificados sin pestaña ni alabeo.',
        status: 'al_dia',
        workshop: 'Frenos & Embragues del Norte',
      },
      {
        id: 'm4',
        type: 'correa',
        title: 'Correa de Accesorios e Inspección de Cadena',
        lastDate: '10 de Noviembre, 2025',
        lastMileage: 35000,
        nextRecommendedMileage: 80000,
        details: 'Motor 1.6 SCe cuenta con cadena de distribución de por vida. Se reemplazó correa de accesorios y polea tensora preventiva.',
        status: 'al_dia',
        workshop: 'Taller Autorizado Sanautos',
      },
      {
        id: 'm5',
        type: 'bateria',
        title: 'Batería Nueva con Garantía Vigente',
        lastDate: '05 de Diciembre, 2025',
        lastMileage: 36200,
        details: 'Batería MAC Gold Plus 48LD (650 CCA). Voltaje actual: 12.6V en reposo, alternador cargando en 14.2V. Garantía física vigente hasta Dic 2027.',
        status: 'al_dia',
        workshop: 'Baterías Mac Colombia',
      },
    ],
    parts: [
      {
        id: 'p1',
        name: 'Lateral Derecho',
        category: 'exterior',
        condition: 'scratches',
        userObservations: 'Rayón superficial de 6 cm en panel de puerta trasera.',
        severity: 'baja',
      },
      {
        id: 'p2',
        name: 'Lateral Izquierdo',
        category: 'exterior',
        condition: 'good',
        userObservations: 'En perfecto estado, pintura original de fábrica.',
        severity: 'optima',
      },
      {
        id: 'p3',
        name: 'Compartimiento del Motor',
        category: 'mecanica',
        condition: 'good',
        userObservations: 'Sin fugas de aceite ni fluidos. Encendido al primer toque.',
        severity: 'optima',
      },
      {
        id: 'p4',
        name: 'Tren Rodante / Llantas',
        category: 'tren_rodante',
        condition: 'good',
        userObservations: 'Llantas con 65% de vida útil.',
        severity: 'optima',
      },
    ],
  },
  {
    id: 'veh_onix_02',
    plate: 'NKM-319',
    brand: 'Chevrolet',
    model: 'Onix Turbo LT',
    year: 2022,
    mileage: 32400,
    color: 'Gris Mercurio',
    score: 64,
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    ownerEmail: 'lenimur03@gmail.com',
    maintenance: [
      {
        id: 'mo1',
        type: 'aceite',
        title: 'Cambio de Aceite Sintético Dexos1',
        lastDate: '10 de Febrero, 2026',
        lastMileage: 30000,
        nextRecommendedMileage: 35000,
        details: 'Aceite AC Delco 5W-30 Dexos1 Gen2.',
        status: 'al_dia',
        workshop: 'Concesionario Autolarte',
      },
    ],
    parts: [],
  },
];

const VehicleContext = createContext<VehicleContextType | undefined>(undefined);

export const VehicleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  
  const [vehicles, setVehicles] = useState<VehicleRecord[]>(() => {
    try {
      const saved = localStorage.getItem('autocheck_vehicles_db');
      return saved ? JSON.parse(saved) : initialVehicles;
    } catch {
      return initialVehicles;
    }
  });

  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('veh_duster_01');

  useEffect(() => {
    localStorage.setItem('autocheck_vehicles_db', JSON.stringify(vehicles));
  }, [vehicles]);

  const currentUserEmail = user?.email || 'lenimur03@gmail.com';

  // Active vehicles belonging to current user
  const myActiveVehicles = vehicles.filter(
    (v) => v.ownerEmail.toLowerCase() === currentUserEmail.toLowerCase() && !v.transferredTo
  );

  // Vehicles transferred by the current user to someone else
  const myTransferredVehicles = vehicles.filter(
    (v) => v.ownerEmail.toLowerCase() === currentUserEmail.toLowerCase() && !!v.transferredTo
  );

  // Selected vehicle for Ficha / Preperitaje
  const selectedVehicle =
    vehicles.find((v) => v.id === selectedVehicleId) ||
    myActiveVehicles[0] ||
    vehicles[0] ||
    null;

  // In-App Transfer function
  const transferVehicle = async (
    vehicleId: string,
    buyerEmail: string
  ): Promise<{ success: boolean; transferFolio?: string; error?: string }> => {
    if (!buyerEmail || !buyerEmail.includes('@')) {
      return { success: false, error: 'Por favor ingresa un correo electrónico válido' };
    }

    if (buyerEmail.toLowerCase() === currentUserEmail.toLowerCase()) {
      return { success: false, error: 'No puedes transferirte el vehículo a tu mismo correo actual' };
    }

    // Simulate transfer transaction
    await new Promise((r) => setTimeout(r, 600));

    const transferFolio = `TRASP-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    const nowStr = new Date().toLocaleDateString('es-CO', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    setVehicles((prev) => {
      return prev.map((v) => {
        if (v.id === vehicleId) {
          // Record transfer in history
          return {
            ...v,
            ownerEmail: buyerEmail.trim().toLowerCase(), // The buyer is now the owner!
            transferredTo: buyerEmail.trim().toLowerCase(),
            transferredAt: nowStr,
            transferFolio,
          };
        }
        return v;
      });
    });

    return { success: true, transferFolio };
  };

  const addMaintenanceToVehicle = (vehicleId: string, item: Omit<MaintenanceItem, 'id'>) => {
    const newItem: MaintenanceItem = {
      ...item,
      id: `m_${Date.now()}`,
    };

    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === vehicleId) {
          return {
            ...v,
            mileage: Math.max(v.mileage, item.lastMileage),
            maintenance: [newItem, ...v.maintenance],
          };
        }
        return v;
      })
    );
  };

  const resetDefaultVehicles = () => {
    setVehicles(initialVehicles);
    localStorage.setItem('autocheck_vehicles_db', JSON.stringify(initialVehicles));
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        myActiveVehicles,
        myTransferredVehicles,
        selectedVehicle,
        setSelectedVehicle: (v) => setSelectedVehicleId(v?.id || ''),
        transferVehicle,
        addMaintenanceToVehicle,
        resetDefaultVehicles,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => {
  const ctx = useContext(VehicleContext);
  if (!ctx) {
    throw new Error('useVehicles must be used within a VehicleProvider');
  }
  return ctx;
};
