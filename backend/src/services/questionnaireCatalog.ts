export const CONDITION_LABELS: Record<string, string> = {
  good: 'En buen estado / Original',
  scratches: 'Rayones leves superficiales',
  dents: 'Golpes / Abolladuras',
  repainted: 'Repintado / Descolorido',
  broken: 'Pieza rota o faltante',
  'not-applicable': 'No aplica',
  glass_scratches: 'Rayones superficiales',
  glass_chips: 'Piquetes o impactos pequeños',
  glass_cracks: 'Fisuras o vidrios estrellados',
  glass_broken: 'Vidrio roto o faltante',
  water_leak: 'Señales de filtración de agua',
  glass_replaced: 'Reemplazado / No original',
  hard_start: 'Encendido difícil o irregular',
  fluid_leak: 'Fugas de aceite u otros fluidos',
  low_fluids: 'Niveles de fluidos bajos',
  engine_noise: 'Ruidos o vibraciones anormales',
  worn_components: 'Componentes desgastados o deteriorados',
  missing_modified_components: 'Componentes faltantes o modificados',
  previous_repairs: 'Evidencia de reparaciones anteriores',
  uneven_wear: 'Desgaste irregular',
  tread_worn: 'Banda de rodadura desgastada',
  tire_cracks_bulges: 'Llantas con grietas, deformaciones o protuberancias',
  tire_repairs: 'Llantas con reparaciones o pinchazos',
  rims_good: 'Rines en buen estado',
  rims_damaged: 'Rines golpeados o deformados',
  lug_nuts_missing: 'Tuercas o elementos de fijación faltantes',
  mismatched_tires: 'Llantas o rines de diferentes referencias',
  normal_wear: 'Desgaste normal por uso',
  stained_upholstery: 'Tapicería manchada o deteriorada',
  dashboard_damaged: 'Tablero rayado, agrietado o deteriorado',
  faulty_controls: 'Mandos o controles defectuosos',
  warning_lights: 'Testigos de advertencia encendidos',
  odometer_visible: 'Odómetro con lectura visible',
  odometer_inconsistent: 'Odómetro con posibles inconsistencias',
  missing_interior_parts: 'Elementos interiores rotos o faltantes',
};

export const PART_CONDITION_LABELS: Record<string, Record<string, string>> = {
  'techo-vidrios': { good: 'Buen estado / Original' },
  'vano-motor': { good: 'Buen estado / Funcionamiento normal' },
  'llantas-frenos': { good: 'Buen estado / Desgaste uniforme' },
  'interior-odometro': { good: 'Buen estado / Bien conservado' },
};

export function conditionLabel(partId: string | undefined, condition: string): string {
  return PART_CONDITION_LABELS[partId || '']?.[condition] || CONDITION_LABELS[condition] || condition;
}

export const GOOD_CONDITIONS = new Set([
  'good',
  'rims_good',
  'normal_wear',
  'odometer_visible',
]);

export const CONDITION_SEVERITY: Record<string, string> = {
  good: 'optima',
  scratches: 'baja',
  dents: 'media',
  repainted: 'media',
  broken: 'alta',
  'not-applicable': 'optima',
  glass_scratches: 'baja',
  glass_chips: 'baja',
  glass_cracks: 'alta',
  glass_broken: 'alta',
  water_leak: 'media',
  glass_replaced: 'media',
  hard_start: 'media',
  fluid_leak: 'alta',
  low_fluids: 'media',
  engine_noise: 'alta',
  worn_components: 'media',
  missing_modified_components: 'alta',
  previous_repairs: 'baja',
  uneven_wear: 'media',
  tread_worn: 'media',
  tire_cracks_bulges: 'alta',
  tire_repairs: 'media',
  rims_good: 'optima',
  rims_damaged: 'media',
  lug_nuts_missing: 'alta',
  mismatched_tires: 'media',
  normal_wear: 'optima',
  stained_upholstery: 'baja',
  dashboard_damaged: 'media',
  faulty_controls: 'media',
  warning_lights: 'alta',
  odometer_visible: 'optima',
  odometer_inconsistent: 'alta',
  missing_interior_parts: 'alta',
};

export function severityForCondition(condition: string): string {
  return CONDITION_SEVERITY[condition] || 'alta';
}

export function isGoodCondition(condition?: string): boolean {
  return !!condition && GOOD_CONDITIONS.has(condition);
}
