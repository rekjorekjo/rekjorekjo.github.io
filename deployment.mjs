/** No placeholder origin: local builds work without a canonical host. */
export function validateRepositoryName(name) {
  if (typeof name !== 'string' || !/^[A-Za-z0-9._-]+$/.test(name) || name === '.' || name === '..') {
    throw new Error('Repository name must contain letters, numbers, dots, underscores or hyphens, and cannot be a dot segment.');
  }
  return name;
}

export function deployment(env = process.env) {
  const input = env.SITE_URL?.trim();
  let site;
  if (input) {
    const url = new URL(input);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
      throw new Error('SITE_URL must be an http(s) origin. Configure the path with BASE_PATH.');
    }
    site = url.origin;
  }
  const inputBase = env.BASE_PATH ?? '/';
  if (inputBase === '/') return { site, base: '/' };
  // Accept one repository segment, optionally wrapped in one slash per side.
  // Validate before URL normalization so dot segments cannot disappear silently.
  const name = validateRepositoryName(inputBase.replace(/^\//, '').replace(/\/$/, ''));
  return { site, base: `/${name}/` };
}
