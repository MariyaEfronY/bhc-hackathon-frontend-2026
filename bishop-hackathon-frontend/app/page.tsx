'use client';

import React, { useState } from 'react';
import Navigation from './components/Navigation';
import DualModeJobSearch from './components/DualModeJobSearch';
import ResumeAnalysisPage from './components/ResumeAnalysisPage';
import { Briefcase, FileSearch, Sparkles } from 'lucide-react';

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
      {/* Ambient Glow Decorative Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Top Sticky Navigation Component */}
        <Navigation onSignIn={handleSignIn} onSignUp={handleSignUp} />

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>AI Powered Career Intelligence Suite</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white">
            Accelerate Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-indigo-400">
              Career Path
            </span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
            Discover roles matched to your voice & skillset, or analyze your resume against ATS standard benchmarks instantly.
          </p>
        </div>

        {/* Central Tab Switcher */}
        <div className="flex justify-center">
          <nav
            aria-label="Career Tool Selection"
            className="flex p-1.5 bg-slate-900/90 backdrop-blur border border-slate-800 rounded-2xl shadow-xl space-x-2"
          >
            <button
              type="button"
              onClick={() => setActiveTab('search')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'search'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Career & Voice Search</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('resume')}
              className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === 'resume'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
            >
              <FileSearch className="h-4 w-4" />
              <span>Resume ATS Scanner</span>
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
        <footer className="pt-12 border-t border-slate-900 text-center text-xs text-slate-600">
          <p>Powered by Next.js & AI Career Analytics Services.</p>
        </footer>
      </div>
    </main>
  );
}