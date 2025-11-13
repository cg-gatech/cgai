export const withBasePath = (path: string) => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!path.startsWith('/')) path = '/' + path;
  if (base && path.startsWith(base)) return path; // avoid double prefix
  return `${base}${path}`;
};
