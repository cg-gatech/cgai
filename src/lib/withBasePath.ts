export const withBasePath = (path: string) => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!path.startsWith('/')) path = '/' + path;
  return `${base}${path}`;
};
