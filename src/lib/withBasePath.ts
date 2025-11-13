// src/lib/withBasePath.ts
export const withBasePath = (path: string): string => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

  if (!path) return base || path;

  // 1) Already an absolute URL (http(s) or protocol-relative) -> leave unchanged
  if (/^(?:https?:)?\/\//i.test(path)) return path;

  // 2) Normalize incoming path to start with single slash
  const normalized = path.startsWith('/') ? path : '/' + path;

  // 3) If no base, return normalized path
  if (!base) return normalized;

  // 4) If path already starts with the base (exact or with trailing slash), return as-is
  if (normalized === base || normalized.startsWith(base + '/')) return normalized;

  // 5) Otherwise prefix base (avoid duplicate slashes)
  return `${base}${normalized}`;
};
