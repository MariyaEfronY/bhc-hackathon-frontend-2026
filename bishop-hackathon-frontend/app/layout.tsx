import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CareerSphere AI | Next-Gen AI Career Path Engine',
  description: 'AI-driven career roadmaps, real-time skill-gap detection, and automated resume analysis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#060813] text-slate-100 min-h-screen relative flex flex-col antialiased selection:bg-cyan-500 selection:text-black">

        {/* Global Ambient Glow Orbs */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-b from-cyan-600/15 via-blue-600/10 to-transparent blur-[140px] pointer-events-none z-0" />
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[160px] pointer-events-none z-0" />

        {/* Dynamic Page Content Rendered Here */}
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>



      </body>
    </html>
  );
}