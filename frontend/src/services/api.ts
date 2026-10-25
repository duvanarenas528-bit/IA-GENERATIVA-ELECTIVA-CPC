const API_BASE = 'http://localhost:4000/api';

type ApiOptions = RequestInit & { skipAuthRedirect?: boolean };

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

async function request(path: string, options: ApiOptions = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  if (res.status === 401 && !options.skipAuthRedirect) {
    if (onUnauthorized) {
      onUnauthorized();
    }
    throw new Error('UNAUTHORIZED');
  }

  return res;
}

export const api = {
  get: (path: string, options?: ApiOptions) => request(path, { ...options, method: 'GET' }),
  post: (path: string, body?: any, options?: ApiOptions) => request(path, { ...options, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: (path: string, body?: any, options?: ApiOptions) => request(path, { ...options, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  del: (path: string, options?: ApiOptions) => request(path, { ...options, method: 'DELETE' }),
};

export async function authMe() {
  const res = await api.get('/auth/me', { skipAuthRedirect: true });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user;
}

export async function authRegister(nombre: string, correo: string, password: string) {
  const res = await api.post('/auth/register', { nombre, correo, password }, { skipAuthRedirect: true });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Error al registrar');
  }
  return data;
}

export async function authLogin(correo: string, password: string) {
  const res = await api.post('/auth/login', { correo, password }, { skipAuthRedirect: true });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) throw new Error('Correo o contraseña incorrectos');
    if (res.status === 429) throw new Error(data.error || 'Demasiados intentos');
    throw new Error(data.error || 'Correo o contraseña incorrectos');
  }
  return data;
}

export async function authLogout() {
  try {
    await api.post('/auth/logout');
  } catch {}
}

export async function authRefresh() {
  const res = await api.post('/auth/refresh', undefined, { skipAuthRedirect: true });
  if (!res.ok) return null;
  const data = await res.json().catch(() => ({}));
  return data.user || null;
}

export async function createVehicle(data: any) {
  const res = await api.post('/vehicles', data);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Error al crear vehículo');
  return json;
}

export async function listVehicles() {
  const res = await api.get('/vehicles');
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { vehicles: [] };
  return json;
}

export async function generateReport(vehicleId: string) {
  const res = await api.post(`/vehicles/${vehicleId}/report`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Error al generar informe');
  return json;
}

export async function listReports() {
  const res = await api.get('/reports');
  const json = await res.json().catch(() => ({}));
  if (!res.ok) return { reports: [] };
  return json;
}

export async function getReport(reportId: string) {
  const res = await api.get(`/reports/${reportId}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || 'Error al obtener informe');
  return json;
}
