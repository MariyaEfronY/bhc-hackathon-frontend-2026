'use client';

import React, { useEffect, useState, JSX } from 'react';

interface StudentUser {
    name?: string;
    email?: string;
    picture?: string;
    avatar?: string;
}

export default function Navbar(): JSX.Element {
    const [user, setUser] = useState<StudentUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    useEffect(() => {
        fetch(`${backendUrl}/api/auth/current-user`, { credentials: 'include' })
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.user) {
                    setUser(data.user);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [backendUrl]);

    const profilePic = user?.picture || user?.avatar;
    const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'S';

    return (
        <header style={styles.header}>
            <h2 style={styles.title}>Student Dashboard</h2>

            <div style={styles.userProfile}>
                {loading ? (
                    <span style={styles.loadingText}>Loading profile...</span>
                ) : (
                    <>
                        <div style={styles.userInfo}>
                            <span style={styles.userName}>{user?.name || 'Student'}</span>
                            <span style={styles.userEmail}>{user?.email || 'student@example.com'}</span>
                        </div>

                        {profilePic ? (
                            <img
                                src={profilePic}
                                alt={user?.name || 'Profile'}
                                style={styles.avatarImg}
                            />
                        ) : (
                            <div style={styles.avatarFallback}>{initial}</div>
                        )}
                    </>
                )}
            </div>
        </header>
    );
}

const styles: Record<string, React.CSSProperties> = {
    header: { height: '70px', borderBottom: '1px solid #334155', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' },
    title: { fontSize: '1.1rem', fontWeight: 600, margin: 0, color: '#f8fafc' },
    userProfile: { display: 'flex', alignItems: 'center', gap: '1rem' },
    userInfo: { display: 'flex', flexDirection: 'column', textAlign: 'right' },
    userName: { fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' },
    userEmail: { fontSize: '0.75rem', color: '#94a3b8' },
    avatarImg: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' },
    avatarFallback: { width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem' },
    loadingText: { fontSize: '0.85rem', color: '#94a3b8' },
};