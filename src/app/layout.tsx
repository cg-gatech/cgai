import type { Metadata } from 'next';
import './globals.css';
import { geistMono, geistSans } from '@/fonts';

export const metadata: Metadata = {
  title: 'CS8803 CGAI: Computer Graphics in AI Era',
  description: 'This webpage serves as the entry point for all interactive demos based on the CGAI course starter code.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
