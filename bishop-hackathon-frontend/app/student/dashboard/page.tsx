'use client';

import React, { JSX, useMemo } from 'react';
import StatCard from '../../components/student/StatCard';
import AnnouncementCard from '../../components/student/AnnouncementCard';
import AIRoadmapWidget from '../../components/student/AIRoadmapWidget';

export default function StudentDashboard(): JSX.Element {
    const greeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning 🌅';
        if (hour < 18) return 'Good Afternoon ☀️';
        return 'Good Evening 🌙';
    }, []);

    return (
        <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 sm:p-6 text-slate-100 min-h-screen">
            {/* Header Section */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-800 pb-4 gap-2">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                        Dashboard Overview
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                        {greeting} — Track your learning path and progress.
                    </p>
                </div>
            </header>

            {/* Quick Metrics Grid: 1 col on mobile, 3 cols on desktop */}
            <section className="w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <StatCard label="Enrolled Courses" value="4" />
                    <StatCard label="Assignments Due" value="2" />
                    <StatCard label="Attendance" value="94%" />
                </div>
            </section>

            {/* Two-Column Layout: Stacks vertically on mobile, 2 cols on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Main Content (AI Roadmap) - Spans 2 cols on Desktop */}
                <main className="lg:col-span-2 flex flex-col gap-6 min-w-0 w-full">
                    <AIRoadmapWidget />
                </main>

                {/* Secondary Content (Announcements Sidebar) - 1 col on Desktop */}
                <aside className="w-full flex flex-col gap-6">
                    <div className="bg-slate-900/90 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-slate-800 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-white">Announcements</h2>
                            <span className="bg-sky-500/10 text-sky-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-500/20">
                                Live
                            </span>
                        </div>
                        <div className="flex flex-col gap-3">
                            <AnnouncementCard
                                title="Hackathon Registration Open"
                                description="Submit your project ideas before Friday midnight."
                            />
                            <AnnouncementCard
                                title="Mid-term Exam Schedule"
                                description="The updated schedule has been posted in the portal."
                            />
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}