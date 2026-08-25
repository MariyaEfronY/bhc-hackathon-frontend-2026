'use client';

import React, { useState } from 'react';
import Navigation from './components/Navigation';
import DualModeJobSearch from './components/DualModeJobSearch';
import ResumeAnalysisPage from './components/ResumeAnalysisPage';
import { Briefcase, FileSearch, Compass, Orbit, Sparkles } from 'lucide-react';

export type ActiveTab = 'search' | 'resume';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');

  const handleSignIn = () => {
    // Implement sign in modal or routing logic
    console.log('Open Sign In');
  };

  const handleSignUp = () => {
    // Implement sign up modal or routing logic
    console.log('Open Sign Up');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Ambient AI Path Navigator Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-600/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Top Navigation Component */}
        <Navigation onSignIn={handleSignIn} onSignUp={handleSignUp} />

        {/* Path Pilot Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 text-xs font-semibold backdrop-blur-md shadow-inner">
            <Compass className="h-4 w-4 text-cyan-400 animate-spin-slow" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-300">
              Path Pilot • Next-Gen AI Career Copilot
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Navigate Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
              AI Career Path
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Chart your trajectory with intelligent voice job matching and deep ATS resume optimization tuned for modern tech benchmarks.
          </p>
        </div>

        {/* Central Tab Switcher */}
        <div className="flex justify-center pt-2">
          <nav
            aria-label="Path Pilot Navigation"
            className="flex p-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl space-x-2"
          >
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'search'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              <Orbit className="h-4 w-4" />
              <span>Career & Voice Search</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'resume'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-950/50'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              <FileSearch className="h-4 w-4" />
              <span>Resume ATS Auditor</span>
            </button>
          </nav>
        </div>

        {/* Dynamic Tab Content */}
        <section className="mt-8 transition-all duration-300">
          {activeTab === 'search' ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <DualModeJobSearch />
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-5xl mx-auto">
              <ResumeAnalysisPage />
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="pt-12 pb-6 border-t border-slate-900/80 text-center text-xs text-slate-500 space-y-2">
          <p>
            © {new Date().getFullYear()} Path Pilot AI — Intelligent Career Navigation Platform. All rights reserved by{' '}
            <a
              href="https://efron-delta.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-4 decoration-cyan-500/30 hover:decoration-cyan-400 transition-all"
            >
              Mariya Efron
            </a>
          </p>
        </footer>
      </div>
    </main>
  );
}