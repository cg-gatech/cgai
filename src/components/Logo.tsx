import Image from 'next/image';
import React from 'react';

const Logo: React.FC = () => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <div className="absolute top-4 left-4 z-10">
      <a
        className="font-[family-name:var(--font-geist-mono)] flex items-center justify-center gap-2 text-background"
        href="/"
        rel="noopener noreferrer"
      >
        <Image src={`${basePath}/cgai_logo.png`} alt="CGAI logomark" width={20} height={20} />
        CGAI
      </a>
    </div>
  );
};

export default Logo;
