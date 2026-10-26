export type ScreenId =
  | 'dashboard'
  | 'nuevo-preperitaje'
  | 'analisis-vivo'
  | 'informe-detallado'
  | 'visor-a4'
  | 'ficha-venta'
  | 'guia-inspeccion'
  | 'perfil'
  | 'admin-dashboard'
  | 'admin-auditoria'
  | 'admin-metricas'
  | 'login-admin'
  | 'login-user';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin' | 'perito';
  authProvider: 'google' | 'local';
  institution?: string;
  licenseNumber?: string;
}

export type PartCondition = 
  | 'good'          // En buen estado / Original
  | 'scratches'     // Rayones leves superficiales
  | 'dents'         // Golpes / Abolladuras
  | 'repainted'     // Repintado / Descolorido
  | 'broken'        // Pieza rota / Faltante
  | 'not-applicable';

export interface VehiclePartEvaluation {
  id: string;
  name: string;
  category: 'exterior' | 'mecanica' | 'interior' | 'tren_rodante';
  condition: PartCondition;
  userObservations: string;
  aiRecommendation?: string;
  suggestedAction?: 'mantener' | 'reparar' | 'reemplazar' | 'monitorear';
  severity: 'baja' | 'media' | 'alta' | 'optima';
}

export interface VehiclePhotoRecord {
  id: string;
  label: string;
  url: string;
  uploadedAt: string;
}

export interface MaintenanceItem {
  id: string;
  type: 'aceite' | 'llantas' | 'frenos' | 'correa' | 'bateria' | 'suspension' | 'otro';
  title: string;
  lastDate: string;
  lastMileage: number;
  nextRecommendedMileage?: number;
  nextRecommendedDate?: string;
  details: string;
  status: 'al_dia' | 'proximo' | 'vencido';
  workshop?: string;
}

export interface VehicleInspection {
  folio: string;
  vehicle: string;
  licensePlate: string;
  year: number;
  mileage: number;
  score: number;
  condition: string;
  status: 'completed' | 'alerts' | 'in-progress' | 'critical';
  valuation: string;
  image: string;
  alt: string;
  date: string;
  observations: string[];
  partsEvaluated?: VehiclePartEvaluation[];
  photos?: VehiclePhotoRecord[];
  maintenance?: MaintenanceItem[];
}

export interface PreperitajeFoto {
  id: string;
  preperitajeId: string;
  zona: string;
  mimeType: string;
  sizeBytes: number;
  creadoEn?: string;
  url: string;
}

export interface PreperitajeParteInforme {
  id: string;
  nombre: string;
  categoria: string;
  categoriaEtiqueta: string;
  condicion: PartCondition | string;
  condicionEtiqueta: string;
  observaciones: string;
  severidad: string;
}

export interface PreperitajeInforme {
  aviso: string;
  generadoPor: 'reglas' | 'gemini';
  folio: string;
  fecha: string;
  usuario: { nombre: string; correo: string };
  vehiculo: {
    placa: string;
    marca: string;
    linea: string;
    anio: number | null;
    kilometraje: number | null;
    color: string;
    combustible: string;
    transmision: string;
  };
  partes: PreperitajeParteInforme[];
  hallazgos: Array<{
    id: string;
    nombre: string;
    categoriaEtiqueta: string;
    condicion: string;
    condicionEtiqueta: string;
    observaciones: string;
    severidad: string;
  }>;
  resumen: {
    totalPartes: number;
    partesBuenas: number;
    partesConProblemas: number;
    partesConObservaciones: number;
    porcentajeBuenas: number;
  };
  diagnostico: {
    titulo: string;
    texto: string;
    recomendacion: string;
  };
  fotos: Array<{
    id: string;
    zona: string;
    zonaEtiqueta: string;
    url: string;
    creadoEn?: string;
  }>;
}
