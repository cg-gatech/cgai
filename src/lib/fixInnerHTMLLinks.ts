// src/lib/fixInnerHTMLLinks.ts
import { withBasePath } from './withBasePath';

export const fixInnerHTMLLinks = (html: string): string => {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!base) return html; // nothing to do

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // elements and their attributes to check
  const attrMap: Array<[string, 'src' | 'href']> = [
    ['a', 'href'],
    ['img', 'src'],
    ['source', 'src'],
    ['video', 'src'],
    ['audio', 'src'],
    ['link', 'href'],
    ['script', 'src'],
  ];

  for (const [selector, attr] of attrMap) {
    doc.querySelectorAll(selector).forEach((el) => {
      const val = el.getAttribute(attr);
      if (!val) return;

      // If absolute URL or protocol-relative, leave it
      if (/^(?:https?:)?\/\//i.test(val)) return;

      // Otherwise rewrite using withBasePath (handles relative and root-relative)
      el.setAttribute(attr, withBasePath(val));
    });
  }

  return doc.body.innerHTML;
};
