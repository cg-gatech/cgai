import { withBasePath } from '@/lib/withBasePath';
import Image from 'next/image';
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="absolute top-4 left-4 z-10">
      <a
        className="font-[family-name:var(--font-geist-mono)] flex items-center justify-center gap-2 text-background"
        href={withBasePath("/")}
        rel="noopener noreferrer"
      >
        <Image src={withBasePath("/cgai_logo.png")} alt="CGAI logomark" width={20} height={20} />
        CGAI
      </a>
    </div>
  );
};

export default Logo;
