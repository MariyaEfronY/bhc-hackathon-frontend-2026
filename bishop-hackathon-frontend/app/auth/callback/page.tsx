'use client';

import React, { useEffect, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { AuthResponse } from '@/types/user';

export default function AuthCallbackPage(): JSX.Element {
    const router = useRouter();

    useEffect(() => {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

        fetch(`${backendUrl}/api/auth/current-user`, {
            credentials: 'include',
        })
            .then((res: Response) => res.json() as Promise<AuthResponse>)
            .then((data: AuthResponse) => {
                if (data.success) {
                    router.push('/dashboard');
                } else {
                    router.push('/auth/login');
                }
            })
            .catch(() => router.push('/auth/login'));
    }, [router]);

    return (
        <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', background: '#0f172a', color: '#fff' }}>
            <p>Authenticating session, please wait...</p>
        </div>
    );
}