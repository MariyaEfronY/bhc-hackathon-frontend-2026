'use client';

import React, { JSX } from 'react';
import StatCard from '../../components/student/StatCard';
import AnnouncementCard from '../../components/student/AnnouncementCard';

export default function StudentDashboard(): JSX.Element {
    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Overview</h1>

            {/* Stats Grid */}
            <div style={styles.grid}>
                <StatCard label="Enrolled Courses" value="4" />
                <StatCard label="Assignments Due" value="2" />
                <StatCard label="Attendance" value="94%" />
            </div>

            {/* Announcements */}
            <div style={styles.section}>
                <h2 style={styles.sectionTitle}>Recent Announcements</h2>
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
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: { display: 'flex', flexDirection: 'column', gap: '2rem' },
    heading: { fontSize: '1.5rem', fontWeight: 'bold' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' },
    section: { backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' },
    sectionTitle: { fontSize: '1.1rem', marginBottom: '1rem', color: '#f8fafc' },
};