'use client';

import React, { useEffect, useState, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfile, AuthResponse } from '@/types/user';

export default function DashboardPage(): JSX.Element {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    useEffect(() => {
        fetch(`${backendUrl}/api/auth/current-user`, {
            credentials: 'include',
        })
            .then((res: Response) => res.json() as Promise<AuthResponse>)
            .then((data: AuthResponse) => {
                if (data.success && data.user) {
                    setUser(data.user);
                } else {
                    router.push('/auth/login');
                }
            })
            .catch(() => router.push('/auth/login'))
            .finally(() => setLoading(false));
    }, [router, backendUrl]);

    const handleLogout = async (): Promise<void> => {
        try {
            await fetch(`${backendUrl}/api/auth/logout`, {
                credentials: 'include',
            });
            router.push('/auth/login');
        } catch (error) {
            console.error('Failed to log out:', error);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
                <p>Loading user profile...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
            <h1>Dashboard</h1>
            {user && (
                <div style={{ marginTop: '1rem', background: '#1e293b', padding: '1.5rem', borderRadius: '8px', maxWidth: '400px' }}>
                    {user.picture && (
                        <img
                            src={user.picture}
                            alt={user.name}
                            style={{ width: '64px', height: '64px', borderRadius: '50%' }}
                        />
                    )}
                    <h2 style={{ marginTop: '0.5rem' }}>{user.name}</h2>
                    <p style={{ color: '#94a3b8' }}>{user.email}</p>
                    <button
                        onClick={handleLogout}
                        style={{
                            marginTop: '1rem',
                            padding: '0.5rem 1rem',
                            background: '#ef4444',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                        }}
                    >
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
}