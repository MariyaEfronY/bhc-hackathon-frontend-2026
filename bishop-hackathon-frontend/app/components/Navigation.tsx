'use client';

import React from 'react';
import { Sparkles, LogIn, UserPlus } from 'lucide-react';

interface NavigationProps {
    onSignIn?: () => void;
    onSignUp?: () => void;
}

export default function Navigation({ onSignIn, onSignUp }: NavigationProps) {
    return (
        <header className="sticky top-4 z-50 flex items-center justify-between bg-slate-900/80 backdrop-blur-md border border-slate-800 p-2 sm:p-2.5 rounded-full shadow-2xl">
            {/* Platform Brand Badge */}
            <div className="flex items-center gap-2 pl-3 sm:pl-4">
                <div className="p-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    <Sparkles className="h-4 w-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold tracking-tight text-white">
                    Career AI Suite
                </span>
            </div>

            {/* Status Indicator & Right Side Auth Actions */}
            <div className="flex items-center gap-2 sm:gap-3 pr-1 sm:pr-2">
                <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-400 mr-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>AI Ready</span>
                </div>

                <button
                    type="button"
                    onClick={onSignIn}
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-full transition-all"
                >
                    <LogIn className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Sign In</span>
                </button>

                <button
                    type="button"
                    onClick={onSignUp}
                    className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full shadow-md transition-all active:scale-95"
                >
                    <UserPlus className="h-3.5 w-3.5 text-purple-400" />
                    <span>Sign Up</span>
                </button>
            </div>
        </header>
    );
}