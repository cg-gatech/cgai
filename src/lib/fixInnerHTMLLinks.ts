export const fixInnerHTMLLinks = (html: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  if (!basePath) return html; // nothing to do if basePath is empty

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  doc.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('/')) {
      a.setAttribute('href', basePath + href);
    }
  });

  return doc.body.innerHTML;
};
