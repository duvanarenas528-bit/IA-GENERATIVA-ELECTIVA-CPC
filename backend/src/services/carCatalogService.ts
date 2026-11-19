import { redis } from '../config/redis.js';

const API_BASE = 'https://api.api-ninjas.com/v2/carfacets';
const CACHE_TTL_SECONDS = 60 * 60 * 24;

export interface FacetValue {
  value: string;
  count: number;
}

export interface CatalogResult {
  values: string[];
  source: 'api-ninjas' | 'fallback';
}

const FALLBACK_MAKES = [
  'Chevrolet', 'Toyota', 'Mercedes-Benz', 'Nissan', 'Volkswagen', 'Ford', 'Audi',
  'Mitsubishi', 'Mazda', 'Hyundai', 'Honda', 'BMW', 'Renault', 'Kia', 'Peugeot',
  'Fiat', 'Jeep', 'Skoda', 'SEAT', 'Volvo', 'Suzuki', 'Isuzu', 'Subaru', 'Lexus',
];

const FALLBACK_MODELS: Record<string, string[]> = {
  Mazda: ['2', '3', '6', 'CX-3', 'CX-5', 'CX-9', 'MX-5', 'BT-50', 'Demio', 'Axela', 'Atenza', '323', '626'],
  Toyota: ['Corolla', 'Camry', 'RAV4', 'Hilux', 'Fortuner', 'Yaris', 'Land Cruiser', 'Prado', 'Innova', 'Hilux SW4'],
  Renault: ['Duster', 'Logan', 'Sandero', 'Captur', 'Clio', 'Megane', 'Symbol', 'Kadjar', 'Talisman'],
  Chevrolet: ['Onix', 'Sail', 'Aveo', 'Spark', 'Tracker', 'Equinox', 'Tacuma', 'Colorado', 'Cruze'],
  Hyundai: ['Atos', 'Accent', 'Elantra', 'Tucson', 'Santa Fe', 'Creta', 'Venue', 'i10', 'i20'],
  Kia: ['Rio', 'Soul', 'Cerato', 'Forte', 'Sportage', 'Sorento', 'Carnival', 'Stinger'],
  Ford: ['Fiesta', 'Focus', 'Escape', 'Explorer', 'Ranger', 'EcoSport', 'Mustang', 'Transit'],
  Nissan: ['Sentra', 'Altima', 'X-Trail', 'Qashqai', 'Frontier', 'Navara', 'Micra', 'Patrol'],
  Volkswagen: ['Gol', 'Vento', 'Jetta', 'Polo', 'Tiguan', 'Touareg', 'Amarok', 'Passat'],
  Honda: ['Civic', 'Accord', 'CR-V', 'HR-V', 'Fit', 'Pilot', 'City', 'Jazz'],
};

function sortText(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
}

function sortYears(values: number[]): number[] {
  return [...new Set(values)].sort((a, b) => b - a);
}

async function fetchFacets(facets: string[], filters: Record<string, string | undefined> = {}): Promise<Record<string, FacetValue[]>> {
  const params = new URLSearchParams();
  params.set('facets', facets.join(','));
  for (const [key, value] of Object.entries(filters)) {
    if (value) params.set(key, value);
  }

  const query = params.toString();
  const cacheKey = `catalog:facets:${query}`;

  try {
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached) as Record<string, FacetValue[]>;
  } catch {
    console.warn('Redis no disponible para caché de catálogo');
  }

  const apiKey = process.env.API_NINJAS_KEY;
  if (!apiKey) throw new Error('API_NINJAS_KEY no configurada');

  const response = await fetch(`${API_BASE}?${query}`, {
    headers: { 'X-Api-Key': apiKey },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`API Ninjas respondió ${response.status}${body ? `: ${body.slice(0, 160)}` : ''}`);
  }

  const data = await response.json() as Record<string, unknown>;
  const normalized: Record<string, FacetValue[]> = {};

  for (const facet of facets) {
    const raw = data[facet];
    if (!Array.isArray(raw)) {
      normalized[facet] = [];
      continue;
    }
    normalized[facet] = raw
      .filter((item): item is Record<string, unknown> => !!item && typeof item === 'object')
      .map((item) => ({
        value: String(item.value ?? '').trim(),
        count: Number(item.count ?? 0),
      }))
      .filter((item) => item.value.length > 0);
  }

  try {
    await redis.set(cacheKey, JSON.stringify(normalized), 'EX', CACHE_TTL_SECONDS);
  } catch {
    console.warn('No se pudo guardar caché de catálogo');
  }

  return normalized;
}

export async function getMakes(): Promise<CatalogResult> {
  try {
    const facets = await fetchFacets(['make']);
    return { values: sortText((facets.make || []).map((item) => item.value)), source: 'api-ninjas' };
  } catch (error) {
    console.warn('Fallback de marcas:', error instanceof Error ? error.message : error);
    return { values: sortText(FALLBACK_MAKES), source: 'fallback' };
  }
}

export async function getModels(make: string): Promise<CatalogResult> {
  try {
    const facets = await fetchFacets(['model'], { make });
    return { values: sortText((facets.model || []).map((item) => item.value)), source: 'api-ninjas' };
  } catch (error) {
    console.warn('Fallback de modelos:', error instanceof Error ? error.message : error);
    return { values: sortText(FALLBACK_MODELS[make] || []), source: 'fallback' };
  }
}

export async function getYears(make: string, model: string): Promise<CatalogResult> {
  try {
    const facets = await fetchFacets(['year'], { make, model });
    const years = (facets.year || [])
      .map((item) => Number(item.value))
      .filter((year) => Number.isInteger(year) && year >= 1900 && year <= new Date().getFullYear() + 1);
    return { values: sortYears(years).map(String), source: 'api-ninjas' };
  } catch (error) {
    console.warn('Fallback de años:', error instanceof Error ? error.message : error);
    const current = new Date().getFullYear() + 1;
    const years = Array.from({ length: current - 1989 }, (_, index) => current - index);
    return { values: years.map(String), source: 'fallback' };
  }
}
