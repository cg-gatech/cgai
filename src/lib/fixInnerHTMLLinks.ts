export const fixInnerHTMLLinks = (html: string): string => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!basePath) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Fix <a href="/...">
  doc.querySelectorAll('a[href]').forEach((el) => {
    const href = el.getAttribute('href');
    if (href && href.startsWith('/')) {
      el.setAttribute('href', basePath + href);
    }
  });

  // Fix <img src="/...">
  doc.querySelectorAll('img[src]').forEach((el) => {
    const src = el.getAttribute('src');
    if (src && src.startsWith('/')) {
      el.setAttribute('src', basePath + src);
    }
  });

  // Fix <video> and <audio> <source src="/...">
  doc.querySelectorAll('source[src]').forEach((el) => {
    const src = el.getAttribute('src');
    if (src && src.startsWith('/')) {
      el.setAttribute('src', basePath + src);
    }
  });

  // Fix <link href="/..."> (for CSS, icons, etc.)
  doc.querySelectorAll('link[href]').forEach((el) => {
    const href = el.getAttribute('href');
    if (href && href.startsWith('/')) {
      el.setAttribute('href', basePath + href);
    }
  });

  // Fix <script src="/...">
  doc.querySelectorAll('script[src]').forEach((el) => {
    const src = el.getAttribute('src');
    if (src && src.startsWith('/')) {
      el.setAttribute('src', basePath + src);
    }
  });

  return doc.body.innerHTML;
};
