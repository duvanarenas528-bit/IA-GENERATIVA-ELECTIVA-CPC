import { conditionLabel, isGoodCondition } from './questionnaireCatalog.js';

const CATEGORY_LABELS: Record<string, string> = {
  exterior: 'Carrocería y pintura',
  mecanica: 'Mecánica',
  tren_rodante: 'Tren rodante',
  interior: 'Interior y cabina',
};

export const ZONE_LABELS: Record<string, string> = {
  frontal: '01. Frontal Tres Cuartos',
  lateral: '02. Lateral Completo',
  motor: '03. Vano Motor',
  odometro: '04. Odómetro y Tablero',
  trasera: '05. Parte Trasera',
  interior: '06. Interior / Tapicería',
};

export const PREFERITAJE_ZONAS = Object.keys(ZONE_LABELS);

type RawPart = {
  id?: string;
  name?: string;
  category?: string;
  condition?: string;
  userObservations?: string;
  severity?: string;
};

type RawFoto = {
  id: string;
  zona: string;
  preperitaje_id: string;
  creado_en?: string;
};

type RawPreperitaje = {
  id: string;
  placa?: string;
  marca?: string;
  linea?: string;
  anio?: number | null;
  kilometraje?: number | null;
  color?: string | null;
  combustible?: string | null;
  transmision?: string | null;
  respuestas?: unknown;
  mantenimiento?: unknown;
  analisis_ia?: unknown;
  analisis_cuestionario?: unknown;
  estado?: string;
  creado_en?: string;
  actualizado_en?: string;
};

function normalizeParts(value: unknown): RawPart[] {
  if (Array.isArray(value)) return value as RawPart[];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as RawPart[]) : [];
    } catch {
      return [];
    }
  }
  return [];
}

function cleanText(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function nullableText(value: unknown): string | null {
  return cleanText(value) || null;
}

function dateString(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === 'string') return value.slice(0, 10) || null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  return null;
}

function nonNegativeNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.round(number) : null;
}

function buildMantenimiento(value: unknown, kilometrajeActual: number | null) {
  const raw = parseAnalisisJson(value) || {};
  const ultimoCambioAceiteFecha = dateString(
    raw.ultimoCambioAceiteFecha ?? raw.ultimo_cambio_aceite_fecha
  );
  const ultimoCambioAceiteKm = nonNegativeNumber(
    raw.ultimoCambioAceiteKm ?? raw.ultimo_cambio_aceite_km
  );
  const ultimoCambioAceiteTaller = nullableText(
    raw.ultimoCambioAceiteTaller ?? raw.ultimo_cambio_aceite_taller
  );
  const ultimoMantenimientoFecha = dateString(
    raw.ultimoMantenimientoFecha ?? raw.ultimo_mantenimiento_fecha
  );
  const ultimoMantenimientoDescripcion = nullableText(
    raw.ultimoMantenimientoDescripcion ?? raw.ultimo_mantenimiento_descripcion
  );
  const ultimoMantenimientoTaller = nullableText(
    raw.ultimoMantenimientoTaller ?? raw.ultimo_mantenimiento_taller
  );

  const kmDesdeCambioAceite =
    kilometrajeActual !== null &&
    ultimoCambioAceiteKm !== null &&
    kilometrajeActual >= ultimoCambioAceiteKm
      ? kilometrajeActual - ultimoCambioAceiteKm
      : null;

  return {
    ultimoCambioAceiteFecha,
    ultimoCambioAceiteKm,
    ultimoCambioAceiteTaller,
    ultimoMantenimientoFecha,
    ultimoMantenimientoDescripcion,
    ultimoMantenimientoTaller,
    kmDesdeCambioAceite,
    proximoCambioAceiteReferencia:
      ultimoCambioAceiteKm !== null ? ultimoCambioAceiteKm + 5000 : null,
    tieneInformacion: !!(
      ultimoCambioAceiteFecha ||
      ultimoCambioAceiteKm !== null ||
      ultimoCambioAceiteTaller ||
      ultimoMantenimientoFecha ||
      ultimoMantenimientoDescripcion ||
      ultimoMantenimientoTaller
    ),
  };
}

function parseAnalisisJson(value: unknown): Record<string, any> | undefined {
  if (!value) return undefined;
  if (typeof value === 'object') return value as Record<string, any>;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export interface PreperitajeReport {
  aviso: 'Diagnóstico de prueba, sin IA';
  generadoPor: 'reglas';
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
  partes: Array<{
    id: string;
    nombre: string;
    categoria: string;
    categoriaEtiqueta: string;
    condicion: string;
    condicionEtiqueta: string;
    observaciones: string;
    severidad: string;
  }>;
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
  mantenimiento: {
    ultimoCambioAceiteFecha: string | null;
    ultimoCambioAceiteKm: number | null;
    ultimoCambioAceiteTaller: string | null;
    ultimoMantenimientoFecha: string | null;
    ultimoMantenimientoDescripcion: string | null;
    ultimoMantenimientoTaller: string | null;
    kmDesdeCambioAceite: number | null;
    proximoCambioAceiteReferencia: number | null;
    tieneInformacion: boolean;
  };
  analisisIA?: Record<string, any> | null;
  analisisCuestionario?: Record<string, any> | null;
  fotos: Array<{
    id: string;
    zona: string;
    zonaEtiqueta: string;
    url: string;
    creadoEn?: string;
  }>;
}

export function buildPreperitajeReport(
  preperitaje: RawPreperitaje,
  fotos: RawFoto[],
  usuario: { nombre?: string; correo?: string }
): PreperitajeReport {
  const parts = normalizeParts(preperitaje.respuestas);
  const mapped = parts.map((part, index) => {
    const condicion = part.condition || 'good';
    const observaciones = cleanText(part.userObservations);
    return {
      id: part.id || `parte-${index + 1}`,
      nombre: cleanText(part.name) || `Parte ${index + 1}`,
      categoria: part.category || 'exterior',
      categoriaEtiqueta: CATEGORY_LABELS[part.category || 'exterior'] || 'General',
      condicion,
      condicionEtiqueta: conditionLabel(part.id, condicion),
      observaciones,
      severidad: part.severity || 'optima',
    };
  });

  const partesBuenas = mapped.filter((p) => isGoodCondition(p.condicion)).length;
  const hallazgos = mapped.filter(
    (p) => !isGoodCondition(p.condicion) && p.condicion !== 'not-applicable'
  );
  const partesConObservaciones = mapped.filter((p) => p.observaciones.length > 0).length;
  const totalPartes = mapped.length;
  const porcentajeBuenas = totalPartes ? Math.round((partesBuenas / totalPartes) * 100) : 0;

  const problemNames = hallazgos.map((p) => p.nombre);
  const textoTitulo =
    totalPartes === 0
      ? 'Cuestionario sin respuestas registradas'
      : hallazgos.length === 0
        ? 'Sin problemas reportados en el cuestionario'
        : hallazgos.length === 1
          ? '1 parte reportada con observaciones'
          : `${hallazgos.length} partes reportadas con observaciones`;

  let texto: string;
  if (totalPartes === 0) {
    texto =
      'Aún no hay respuestas registradas para este preperitaje. Completa el cuestionario del paso 2 para generar un diagnóstico basado en tus datos.';
  } else if (hallazgos.length === 0) {
    texto = `Según tus respuestas, las ${totalPartes} partes evaluadas están en buen estado o fueron marcadas como no aplicables. No se registraron problemas en el cuestionario.`;
  } else {
    texto = `Según tus respuestas, ${hallazgos.length} de ${totalPartes} partes presentan observaciones: ${problemNames.join(
      ', '
    )}. ${partesBuenas === 1 ? 'La parte restante fue reportada en buen estado' : `Las ${partesBuenas} partes restantes fueron reportadas en buen estado`}.`;
  }

  const recomendacion =
    hallazgos.length > 0
      ? 'Con base en las partes que marcaste con problemas, se recomienda una revisión presencial antes de cerrar la compra o venta. Este texto se genera con reglas simples a partir de tus respuestas.'
      : 'No marcaste problemas en las partes evaluadas. Puedes continuar con el proceso, teniendo en cuenta que este resultado no reemplaza una inspección física profesional.';

  const fecha = preperitaje.actualizado_en || preperitaje.creado_en || new Date().toISOString();
  const folio = `AC-${String(preperitaje.id).slice(0, 8).toUpperCase()}`;

  return {
    aviso: 'Diagnóstico de prueba, sin IA',
    generadoPor: 'reglas',
    folio,
    fecha,
    usuario: {
      nombre: cleanText(usuario.nombre) || 'Usuario AutoCheck',
      correo: cleanText(usuario.correo),
    },
    vehiculo: {
      placa: cleanText(preperitaje.placa),
      marca: cleanText(preperitaje.marca),
      linea: cleanText(preperitaje.linea),
      anio: preperitaje.anio ?? null,
      kilometraje: preperitaje.kilometraje ?? null,
      color: cleanText(preperitaje.color),
      combustible: cleanText(preperitaje.combustible),
      transmision: cleanText(preperitaje.transmision),
    },
    partes: mapped,
    hallazgos: hallazgos.map((p) => ({
      id: p.id,
      nombre: p.nombre,
      categoriaEtiqueta: p.categoriaEtiqueta,
      condicion: p.condicion,
      condicionEtiqueta: p.condicionEtiqueta,
      observaciones: p.observaciones,
      severidad: p.severidad,
    })),
    resumen: {
      totalPartes,
      partesBuenas,
      partesConProblemas: hallazgos.length,
      partesConObservaciones,
      porcentajeBuenas,
    },
    diagnostico: {
      titulo: textoTitulo,
      texto,
      recomendacion,
    },
    mantenimiento: buildMantenimiento(
      preperitaje.mantenimiento,
      typeof preperitaje.kilometraje === 'number' ? preperitaje.kilometraje : null
    ),
    ...(parseAnalisisJson(preperitaje.analisis_ia)
      ? { analisisIA: parseAnalisisJson(preperitaje.analisis_ia) }
      : {}),
    ...(parseAnalisisJson(preperitaje.analisis_cuestionario)
      ? { analisisCuestionario: parseAnalisisJson(preperitaje.analisis_cuestionario) }
      : {}),
    fotos: fotos.map((foto) => ({
      id: foto.id,
      zona: foto.zona,
      zonaEtiqueta: ZONE_LABELS[foto.zona] || foto.zona,
      url: `/api/preperitajes/${foto.preperitaje_id}/fotos/${foto.id}/archivo`,
      creadoEn: foto.creado_en,
    })),
  };
}
