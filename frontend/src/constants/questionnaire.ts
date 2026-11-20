import type { PartCondition } from '../types';

export type ConditionSeverity = 'baja' | 'media' | 'alta' | 'optima';

export interface ConditionOption {
  value: PartCondition;
  label: string;
  icon: string;
  color: string;
}

const COLORS = {
  good: 'border-emerald-500 bg-emerald-50 text-emerald-800',
  low: 'border-amber-400 bg-amber-50 text-amber-800',
  medium: 'border-orange-500 bg-orange-50 text-orange-800',
  high: 'border-rose-500 bg-rose-50 text-rose-800',
  info: 'border-blue-500 bg-blue-50 text-blue-800',
};

export const CONDITION_LABELS: Record<PartCondition, string> = {
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

export const GOOD_CONDITIONS = new Set<PartCondition>([
  'good',
  'rims_good',
  'normal_wear',
  'odometer_visible',
]);

export const CONDITION_SEVERITY: Record<PartCondition, ConditionSeverity> = {
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

const option = (
  value: PartCondition,
  icon: string,
  color: string,
  label?: string
): ConditionOption => ({
  value,
  label: label || CONDITION_LABELS[value],
  icon,
  color,
});

export const DEFAULT_CONDITION_OPTIONS: ConditionOption[] = [
  option('good', 'check_circle', COLORS.good),
  option('scratches', 'draw', COLORS.low),
  option('dents', 'handyman', COLORS.medium),
  option('repainted', 'format_paint', COLORS.info),
  option('broken', 'warning', COLORS.high),
];

export const PART_CONDITION_OPTIONS: Record<string, ConditionOption[]> = {
  'techo-vidrios': [
    option('good', 'check_circle', COLORS.good, 'Buen estado / Original'),
    option('glass_scratches', 'draw', COLORS.low),
    option('glass_chips', 'blur_on', COLORS.low),
    option('glass_cracks', 'warning', COLORS.high),
    option('glass_broken', 'broken_image', COLORS.high),
    option('water_leak', 'water_drop', COLORS.medium),
    option('glass_replaced', 'format_paint', COLORS.info),
  ],
  'vano-motor': [
    option('good', 'check_circle', COLORS.good, 'Buen estado / Funcionamiento normal'),
    option('hard_start', 'power_settings_new', COLORS.medium),
    option('fluid_leak', 'water_drop', COLORS.high),
    option('low_fluids', 'local_drink', COLORS.medium),
    option('engine_noise', 'graphic_eq', COLORS.high),
    option('worn_components', 'build', COLORS.medium),
    option('missing_modified_components', 'extension', COLORS.high),
    option('previous_repairs', 'history', COLORS.low),
  ],
  'llantas-frenos': [
    option('good', 'check_circle', COLORS.good, 'Buen estado / Desgaste uniforme'),
    option('uneven_wear', 'trending_down', COLORS.medium),
    option('tread_worn', 'tire_repair', COLORS.medium),
    option('tire_cracks_bulges', 'warning', COLORS.high),
    option('tire_repairs', 'healing', COLORS.medium),
    option('rims_good', 'check_circle', COLORS.good),
    option('rims_damaged', 'disc_full', COLORS.medium),
    option('lug_nuts_missing', 'extension', COLORS.high),
    option('mismatched_tires', 'compare_arrows', COLORS.medium),
  ],
  'interior-odometro': [
    option('good', 'check_circle', COLORS.good, 'Buen estado / Bien conservado'),
    option('normal_wear', 'check_circle', COLORS.good),
    option('stained_upholstery', 'airline_seat_recline_normal', COLORS.low),
    option('dashboard_damaged', 'desktop_windows', COLORS.medium),
    option('faulty_controls', 'tune', COLORS.medium),
    option('warning_lights', 'tips_and_updates', COLORS.high),
    option('odometer_visible', 'speed', COLORS.good),
    option('odometer_inconsistent', 'speed', COLORS.high),
    option('missing_interior_parts', 'broken_image', COLORS.high),
  ],
};

export const PART_INSPECTION_INSTRUCTIONS: Record<string, string> = {
  'lateral-der':
    'Párate en una esquina del vehículo y mira de perfil a lo largo de todo el costado para detectar ondas o hundimientos en la lámina. Verifica diferencias de tono en la pintura, abre y cierra cada puerta para comprobar que ajusten sin esfuerzo y revisa la firmeza del espejo retrovisor.',
  'lateral-izq':
    'Observa todo el costado en ángulo diagonal contra la luz para identificar abolladuras, rayones o cambios de color en la pintura. Abre y cierra las puertas verificando que las líneas de unión estén parejas y que las manijas y molduras estén completas y firmes.',
  'frente-capo':
    'Revisa de frente que el espacio entre el capó y los guardabarros sea simétrico en ambos lados. Observa que el parachoques esté bien ajustado, que la persiana no tenga piezas rotas y que las micas de los faros estén transparentes y sin humedad interna.',
  'trasera-baul':
    'Abre y cierra la compuerta del baúl verificando que los amortiguadores la sostengan y que el seguro cierre suave. Revisa que los stops estén intactos, sin filtraciones de agua, y que el parachoques no tenga hundimientos ni desajustes.',
  'techo-vidrios':
    'Revisa los vidrios desde adentro hacia afuera contra la luz para detectar piquetes o fisuras. Verifica el sello grabado del fabricante en las esquinas de cada cristal, el estado de los empaques y que no existan manchas de humedad en el tapizado del techo.',
  'vano-motor':
    'Con el vehículo apagado y en terreno plano, abre el capó y verifica los niveles en los recipientes de refrigerante, frenos y la varilla de aceite, buscando manchas o fugas frescas. Luego enciende el motor y escucha durante 30 segundos que el arranque sea inmediato y el sonido parejo.',
  'llantas-frenos':
    'Gira la dirección hacia un lado para revisar la profundidad y uniformidad del dibujo en toda la banda de rodadura, verificando que no haya grietas ni protuberancias en los costados. Revisa el borde de los 4 rines en busca de golpes y cuenta que todas las tuercas estén completas.',
  'interior-odometro':
    'Gira la llave a posición de contacto sin encender para comprobar que prendan los testigos del tablero, y luego enciende el motor verificando que se apaguen las alertas. Revisa la lectura del odómetro, el estado de la tapicería y el funcionamiento de controles, cinturones y aire acondicionado.',
};

export function inspectionInstructionsForPart(partId: string): string | undefined {
  return PART_INSPECTION_INSTRUCTIONS[partId];
}

export function conditionOptionsForPart(partId: string): ConditionOption[] {
  return PART_CONDITION_OPTIONS[partId] || DEFAULT_CONDITION_OPTIONS;
}

export function severityForCondition(condition: PartCondition): ConditionSeverity {
  return CONDITION_SEVERITY[condition] || 'alta';
}

export function isGoodCondition(condition?: string | null): boolean {
  return !!condition && GOOD_CONDITIONS.has(condition as PartCondition);
}
