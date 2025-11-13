'use client';

import { useEffect, useRef } from 'react';
import { NavBar } from '@/components/NavBar';
import Image from 'next/image';
import { withBasePath } from '@/lib/withBasePath';

export default function AssignmentPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;
    
    fetch(withBasePath("/assignments/A4.html"))
      .then((res) => res.text())
      .then((rawHTML) => {
        // Step 1: Fix relative URLs in src/href attributes
        const fixedHTML = rawHTML.replace(
          /(src|href)=["']\/(?!\/)/g, // Match src="/..." or href="/..."
          `$1="${withBasePath("/")}`
        );

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        // Dynamically inject the <base> tag
        const base = doc.createElement("base");
        base.href = window.location.origin + withBasePath("/");
        doc.head.prepend(base);

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
    })
      .catch((err) => console.error("Failed to load iframe HTML:", err));

  }, []);
  return (
    <div className="bg-robot-bg bg-cover bg-center grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-6xl w-full">
        {/* Logo and Title Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          {/* Logo */}
          <Image src={withBasePath("/cgai_logo.png")} alt="CGAI logo" width={256} height={256} priority />
          {/* Title and Description */}
          <div className="text-center sm:text-left w-full">
            <p className="text-3xl font-bold font-[family-name:var(--font-geist-mono)] leading-loose">
              CS8803/4803 CGA: Computer Graphics in AI Era
            </p>
            <p className="text-2xl font-[family-name:var(--font-geist-mono)] mt-2 leading-relaxed">
              Assignment 4: Position-based Dynamics
            </p>
          </div>
        </div>
        <NavBar />
        {/* Assignment Content Section */}
        <iframe 
          ref={iframeRef}
          className="w-full h-[5000px] border rounded-lg bg-yellow-50"
          title="Assignment 4"
        />
      </main>
    </div>
  );
}
