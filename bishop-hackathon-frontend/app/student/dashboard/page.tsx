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
        <div style={styles.container}>
            {/* Header Section */}
            <header style={styles.header}>
                <div>
                    <h1 style={styles.heading}>Dashboard Overview</h1>
                    <p style={styles.subheading}>{greeting} — Track your learning path and progress.</p>
                </div>
            </header>

            {/* Quick Metrics Grid */}
            <section style={styles.gridSection}>
                <div style={styles.grid}>
                    <StatCard label="Enrolled Courses" value="4" />
                    <StatCard label="Assignments Due" value="2" />
                    <StatCard label="Attendance" value="94%" />
                </div>
            </section>

            {/* Two-Column Core Layout (Main Content + Sidebar Announcements) */}
            <div style={styles.layoutGrid}>
                {/* Main Interactive AI Roadmap */}
                <main style={styles.mainColumn}>
                    <AIRoadmapWidget />
                </main>

                {/* Secondary Content Side Panel */}
                <aside style={styles.sideColumn}>
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>
                            <h2 style={styles.sectionTitle}>Announcements</h2>
                            <span style={styles.badge}>Live</span>
                        </div>
                        <div style={styles.announcementsList}>
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

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%',
        padding: '0.5rem',
    },
    header: {
        display: 'flex',
        justify: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid #1e293b',
        paddingBottom: '1rem',
    },
    heading: {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#f8fafc',
        margin: 0,
        letterSpacing: '-0.025em',
    },
    subheading: {
        fontSize: '0.9rem',
        color: '#94a3b8',
        margin: '0.4rem 0 0 0',
    },
    gridSection: {
        width: '100%',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
    },
    layoutGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2rem',
        alignItems: 'start',
    },
    mainColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        minWidth: 0, // Prevents flex/grid overflowing on child code blocks
    },
    sideColumn: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
    },
    section: {
        backgroundColor: '#1e293b',
        padding: '1.5rem',
        borderRadius: '16px',
        border: '1px solid #334155',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    },
    sectionHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.25rem',
    },
    sectionTitle: {
        fontSize: '1.15rem',
        fontWeight: '600',
        color: '#f8fafc',
        margin: 0,
    },
    badge: {
        backgroundColor: '#0284c720',
        color: '#38bdf8',
        fontSize: '0.75rem',
        fontWeight: '600',
        padding: '0.2rem 0.6rem',
        borderRadius: '9999px',
        border: '1px solid #0369a140',
    },
    announcementsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
};