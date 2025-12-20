'use client';

import { useEffect, useState, useRef } from 'react';
import { NavBar } from '@/components/NavBar';
import Image from 'next/image';
import { withBasePath } from '@/lib/withBasePath';
import { fixInnerHTMLLinks } from '@/lib/fixInnerHTMLLinks';

export default function AssignmentPage() {
  const [htmlContent, setHtmlContent] = useState('');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch(withBasePath('/assignments/A3.html'))
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.text();
      })
      .then((data) => {
        const fixedHtml = fixInnerHTMLLinks(data);
        setHtmlContent(fixedHtml);
      })
      .catch((error) => console.error('Failed to load HTML content:', error));
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    iframe.onload = () => {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) return;

      const style = doc.createElement("style");
      style.textContent = `
        body {
          word-wrap: break-word;
          white-space: normal;
          overflow-wrap: break-word;
          line-height: 1.6;
        }
        
        pre, code {
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      `;
      doc.head.appendChild(style);
    };
  }, []);

  return (
    <div className="bg-robot-bg bg-cover bg-center grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-6xl w-full">
        {/* Logo and Title Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          {/* Logo */}
          <Image
            src={withBasePath("/cgai_logo.png")}
            alt="CGAI logo"
            width={256}
            height={256}
            priority
          />
          {/* Title and Description */}
          <div className="text-center sm:text-left w-full">
            <p className="text-3xl font-bold font-[family-name:var(--font-geist-mono)] leading-loose">
              CS8803/4803 CGA: Computer Graphics in AI Era
            </p>
            <p className="text-2xl font-[family-name:var(--font-geist-mono)] mt-2 leading-relaxed">
              Assignment 3: Gaussian Splatting
            </p>
          </div>
        </div>
        <NavBar />
        {/* Assignment Content Section */}
        <iframe 
          ref={iframeRef}
          src={withBasePath("/assignments/A3.html")}
          className="w-full h-[7200px] bg-yellow-50 text-black p-8 rounded-lg shadow-lg"
        />
      </main>
    </div>
  );
}
