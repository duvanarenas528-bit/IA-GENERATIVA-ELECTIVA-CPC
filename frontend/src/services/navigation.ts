export function reportIdFromPath(): string | null {
  const match = window.location.pathname.match(/^\/informe\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function openReport(id: string) {
  window.history.pushState({}, '', `/informe/${encodeURIComponent(id)}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export function resetAppPath() {
  if (window.location.pathname !== '/') {
    window.history.pushState({}, '', '/');
  }
}
