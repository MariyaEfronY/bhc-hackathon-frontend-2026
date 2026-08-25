'use client';

import React, { JSX } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'My Courses', path: '/student/courses' },
    { label: 'Profile', path: '/student/profile' },
];

export default function Sidebar(): JSX.Element {
    const pathname = usePathname();
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    const handleLogout = (): void => {
        window.location.href = `${backendUrl}/api/auth/logout`;
    };

    return (
        <aside style={styles.sidebar}>
            <div style={styles.brand}>Student Portal</div>
            <nav style={styles.nav}>
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            style={{
                                ...styles.navLink,
                                ...(isActive ? styles.activeLink : {}),
                            }}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <button onClick={handleLogout} style={styles.logoutBtn}>
                Logout
            </button>
        </aside>
    );
}

const styles: Record<string, React.CSSProperties> = {
    sidebar: { width: '250px', backgroundColor: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', padding: '1.5rem', minHeight: '100vh' },
    brand: { fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '2rem', color: '#60a5fa' },
    nav: { display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 },
    navLink: { padding: '0.75rem 1rem', borderRadius: '8px', color: '#94a3b8', textDecoration: 'none', fontWeight: 500, transition: 'all 0.2s' },
    activeLink: { backgroundColor: '#2563eb', color: '#ffffff' },
    logoutBtn: { padding: '0.75rem', borderRadius: '8px', border: '1px solid #ef4444', backgroundColor: 'transparent', color: '#ef4444', fontWeight: 600, cursor: 'pointer', marginTop: 'auto' },
};