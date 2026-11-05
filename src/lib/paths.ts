/** Internal paths are relative to the configured deployment root. */
export function withBase(path = ''): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return `${base}/${path.replace(/^\/+/, '')}`;
}

export function postUrl(id: string): string {
  return withBase(`posts/${id.split('/').map(encodeURIComponent).join('/')}/`);
}
