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

        {/* Global Footer */}
        <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} CareerSphere AI. Built for Next.js App Router.</p>
            <div className="flex items-center gap-6 text-slate-400">
              <a href="#analyzer" className="hover:text-cyan-400 transition-colors">Analyzer</a>
              <a href="#roadmap" className="hover:text-cyan-400 transition-colors">Skill Graph</a>
              <a href="/login" className="hover:text-cyan-400 transition-colors">Portal Login</a>
            </div>
          </div>
        </footer>

      </body>
    </html>
  );
}