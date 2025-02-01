'use client'; 

import { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import Image from 'next/image';

export default function AssignmentPage() {
  const [htmlContent, setHtmlContent] = useState('');

  useEffect(() => {
    fetch('/assignments/A1b.html')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then((data) => setHtmlContent(data)) 
      .catch((error) => console.error('Failed to load HTML content:', error)); 
  }, []);

  return (
    <div className="bg-robot-bg bg-cover bg-center grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-6xl w-full">
        {/* Logo and Title Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
          {/* Logo */}
          <Image
            src="/cgai_logo.png"
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
              Google Colab Tutorial
            </p>
          </div>
        </div>
        <NavBar />
        {/* Assignment Content Section */}
        {htmlContent ? (
          <section
            className="bg-yellow-50 text-black p-8 rounded-lg shadow-lg w-full"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        ) : (
          <p>Loading...</p>
        )}
      </main>
    </div>
  );
}
