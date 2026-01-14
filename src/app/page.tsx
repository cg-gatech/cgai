import { NavBar } from '@/components/NavBar';
import Image from 'next/image';
// import Landing from '@/components/landing/Landing';

export default function Home() {
  return (
    <>
      {/* <Landing /> */}
      {/* Temporary robot bg */}
      <div className="bg-robot-bg bg-cover bg-center grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Logo */}
            <Image
              src="/cgai_logo.png"
              alt="CGAI logo"
              width={256}
              height={256}
              priority
            />
            {/* Title and Paragraph */}
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold font-[family-name:var(--font-geist-mono)] leading-relaxed">
                School of Interactive Computing, Georgia Institute of Technology, 2026 Spring
              </p>
              <p className="text-3xl font-bold font-[family-name:var(--font-geist-mono)] leading-loose">
                CS8803 CGAI: Computer Graphics in AI Era
              </p>
              <p className="text-sm font-[family-name:var(--font-geist-mono)] mt-2 leading-relaxed">
                This webpage serves as the entry point for all interactive demos based on the CGAI course starter code. Here, you can run tutorial code and assignment starter code,  access assignment documents, reading materials, and course information by selecting them from the menus below. 
              </p>
            </div>
          </div>
          <NavBar />
        </main>
      </div>
    </>
  );
}
