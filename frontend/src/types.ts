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

export interface AdminRecentPreperitaje {
  id: string;
  placa: string;
  marca?: string | null;
  linea?: string | null;
  anio?: number | null;
  kilometraje?: number | null;
  color?: string | null;
  combustible?: string | null;
  transmision?: string | null;
  estado: 'borrador' | 'completado';
  creado_en?: string;
  actualizado_en?: string;
  usuario: { nombre: string; correo: string };
  fotoPrincipalUrl: string | null;
  fotoPrincipalEtiqueta: string | null;
  totalPartes: number;
  partesBuenas: number;
  hallazgos: number;
  score: number;
  riesgo: 'bajo' | 'medio' | 'alto';
}

export interface AdminOverview {
  stats: {
    usuarios: number;
    total: number;
    completados: number;
    borradores: number;
    ultimas24h: number;
    ultimos7dias: number;
    fotos: number;
    conHallazgos: number;
  };
  recientes: AdminRecentPreperitaje[];
}

export type PartCondition =
  | 'good'
  | 'scratches'
  | 'dents'
  | 'repainted'
  | 'broken'
  | 'not-applicable'
  | 'glass_scratches'
  | 'glass_chips'
  | 'glass_cracks'
  | 'glass_broken'
  | 'water_leak'
  | 'glass_replaced'
  | 'hard_start'
  | 'fluid_leak'
  | 'low_fluids'
  | 'engine_noise'
  | 'worn_components'
  | 'missing_modified_components'
  | 'previous_repairs'
  | 'uneven_wear'
  | 'tread_worn'
  | 'tire_cracks_bulges'
  | 'tire_repairs'
  | 'rims_good'
  | 'rims_damaged'
  | 'lug_nuts_missing'
  | 'mismatched_tires'
  | 'normal_wear'
  | 'stained_upholstery'
  | 'dashboard_damaged'
  | 'faulty_controls'
  | 'warning_lights'
  | 'odometer_visible'
  | 'odometer_inconsistent'
  | 'missing_interior_parts';

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

export interface AnalisisIA {
  estado_general: string;
  hallazgos: Array<{
    zona?: string;
    titulo: string;
    detalle?: string;
    severidad?: string;
  }>;
  recomendaciones: string[];
  valoracion: {
    min: number;
    max: number;
    moneda: string;
    factores?: string[];
  };
  generadoEn?: string;
  modelo?: string;
  fotosAnalizadas?: number;
  aviso?: string;
}

export interface MantenimientoInforme {
  ultimoCambioAceiteFecha: string | null;
  ultimoCambioAceiteKm: number | null;
  ultimoCambioAceiteTaller: string | null;
  ultimoMantenimientoFecha: string | null;
  ultimoMantenimientoDescripcion: string | null;
  ultimoMantenimientoTaller: string | null;
  kmDesdeCambioAceite: number | null;
  proximoCambioAceiteReferencia: number | null;
  tieneInformacion: boolean;
}

export interface AnalisisCuestionarioIA {
  resumen: string;
  comentarios: Array<{
    parte: string;
    comentario: string;
    explicacion: string;
    orientacion: string;
    prioridad: string;
  }>;
  recomendaciones_generales: string[];
  preguntas_sugeridas: string[];
  generadoEn?: string;
  modelo?: string;
  comentariosAnalizados?: number;
  aviso?: string;
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
  mantenimiento: MantenimientoInforme;
  analisisIA?: AnalisisIA | null;
  analisisCuestionario?: AnalisisCuestionarioIA | null;
  fotos: Array<{
    id: string;
    zona: string;
    zonaEtiqueta: string;
    url: string;
    creadoEn?: string;
  }>;
}

export interface CatalogResult {
  values: string[];
  source: 'api-ninjas' | 'fallback';
}

export interface ProfilePeritaje {
  id: string;
  placa: string;
  marca: string | null;
  linea: string | null;
  anio: number | null;
  estado: string;
  creadoEn: string | null;
  actualizadoEn: string | null;
  score: number | null;
  aprobadoIA: boolean;
  tieneAnalisisIA: boolean;
  transferidoA?: string | null;
}

export interface ProfileStats {
  stats: {
    total: number;
    completados: number;
    tasaAprobacionIA: number;
    tiempoPromedioMinutos: number;
    certificados: number;
    transferidosRecibidos: number;
  };
  peritajes: ProfilePeritaje[];
}
