export function validateCategorySegment(name: string): string {
  if (!name || name !== name.trim() || name === '.' || name === '..'
    || /[/\\\u0000-\u001f\u007f]/u.test(name)
    || !/^[\p{L}\p{M}\p{N} ._-]+$/u.test(name)
    || /[. ]$/u.test(name)
    || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/iu.test(name)) {
    throw new Error(`非法分类名称 ${JSON.stringify(name)}：仅允许文字、数字、内部空格及 ._-，禁止路径分隔符、点段、尾随点或空白及系统保留名称。`);
  }
  if (new TextDecoder().decode(new TextEncoder().encode(name)) !== name) {
    throw new Error(`非法分类名称 ${JSON.stringify(name)}：包含无效 Unicode。`);
  }
  return name;
}

export function validateTagName(name: string): string {
  if (!name.trim() || /[\u0000-\u001f\u007f]/u.test(name)
    || new TextDecoder().decode(new TextEncoder().encode(name)) !== name) {
    throw new Error(`非法标签名称 ${JSON.stringify(name)}：名称不能为空、含控制字符或无效 Unicode。`);
  }
  return name;
}

// Fixed-length lowercase ASCII: independent of URL decoding, filesystem case
// rules, slash interpretation and the UTF-8 length of a human-readable label.
export function tagSlug(name: string): string {
  validateTagName(name);
  // FNV-1a 128 is a deterministic URL identifier, not a security hash.
  // All labels are also checked together by registerRoute; a collision is fatal.
  let hash = 0x6c62272e07bb014262b821756295c58dn;
  for (const byte of new TextEncoder().encode(name)) {
    hash = BigInt.asUintN(128, (hash ^ BigInt(byte)) * 0x1000000000000000000013bn);
  }
  return `t-${hash.toString(16).padStart(32, '0')}`;
}

export function categoryRoute(path: readonly string[]): string {
  if (!path.length) throw new Error('分类路径不能为空。');
  return path.map(name => encodeURIComponent(validateCategorySegment(name))).join('/');
}

/** Reject portable URL aliases instead of allowing a static file to win. */
export function registerRoute(registry: Map<string, string>, route: string, identity: string): void {
  const canonical = decodeURIComponent(route).normalize('NFC').toUpperCase().toLowerCase().normalize('NFC');
  const existing = registry.get(canonical);
  if (existing !== undefined && existing !== identity) {
    throw new Error(`分类/标签 URL 冲突：${existing} 与 ${identity} 都映射到 ${route}。请重命名。`);
  }
  registry.set(canonical, identity);
}

export function collectCategoryPaths(paths: readonly string[][]): string[][] {
  const routes = new Map<string, string>();
  const unique = new Map<string, string[]>();
  for (const path of paths) {
    categoryRoute(path);
    for (let size = 1; size <= path.length; size++) {
      const prefix = path.slice(0, size);
      const identity = JSON.stringify(prefix);
      // Normalize before encoding too: composed/decomposed names alias on some hosts.
      const portable = categoryRoute(prefix.map(name => name.normalize('NFC')));
      registerRoute(routes, `categories/${portable}`, identity);
      unique.set(identity, prefix);
    }
  }
  return [...unique.values()].sort((a, b) => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      const result = a[i].localeCompare(b[i], 'zh-CN');
      if (result) return result;
    }
    return a.length - b.length;
  });
}

export function collectTags(postTags: readonly string[][]): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  const routes = new Map<string, string>();
  for (const tags of postTags) for (const name of new Set(tags)) {
    const slug = tagSlug(name);
    registerRoute(routes, `tags/${slug}`, JSON.stringify(name));
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return [...counts].map(([name, count]) => ({ name, slug: tagSlug(name), count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'zh-CN'));
}
