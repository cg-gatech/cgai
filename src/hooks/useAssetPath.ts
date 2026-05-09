export const useAssetPath = () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return (path: string) => {
    if (!path.startsWith('/')) path = '/' + path;
    return `${basePath}${path}`;
  };
};
