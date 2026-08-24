'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const FloatingNavbar: React.FC = () => {
    const [activeTab, setActiveTab] = useState('analyzer');

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl">
            <nav className="flex items-center justify-between px-6 py-3 bg-slate-900/70 backdrop-blur-xl border border-slate-800/80 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)] transition-all duration-300">

                {/* Brand Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center font-black text-white text-sm shadow-md shadow-cyan-500/30">
                        ⚡
                    </div>
                    <span className="font-extrabold text-sm tracking-tight text-white">
                        Career<span className="text-cyan-400">Sphere</span>
                    </span>
                </Link>

                {/* Navigation Tabs */}
                <div className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1 rounded-full border border-slate-800/60">
                    {[
                        { id: 'analyzer', label: 'Analyzer', href: '#analyzer' },
                        { id: 'roadmap', label: 'Skill Graph', href: '#roadmap' },
                    ].map((item) => (
                        <a
                            key={item.id}
                            href={item.href}
                            onClick={() => setActiveTab(item.id)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${activeTab === item.id
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-2">
                    <Link
                        href="/login"
                        className="px-4 py-2 rounded-full text-xs font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all shadow-lg shadow-cyan-500/20"
                    >
                        Sign In
                    </Link>
                </div>
            </nav>
        </div>
    );
};