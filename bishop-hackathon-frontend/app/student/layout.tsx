'use client';

import React, { JSX } from 'react';
import Sidebar from '../components/student/Sidebar';
import Navbar from '../components/student/Navbar';

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    return (
        <div style={styles.shell}>
            <Sidebar />
            <div style={styles.mainContainer}>
                <Navbar />
                <main style={styles.content}>{children}</main>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    shell: { display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: '#f8fafc' },
    mainContainer: { flex: 1, display: 'flex', flexDirection: 'column' },
    content: { padding: '2rem', flex: 1 },
};