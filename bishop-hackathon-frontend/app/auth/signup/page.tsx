'use client';

import React, { useState, JSX, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage(): JSX.Element {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

    const handleManualSignUp = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${backendUrl}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // Includes session cookies cross-origin
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                router.push('/dashboard');
            } else {
                setError(data.message || 'Failed to create account');
            }
        } catch {
            setError('Could not connect to the authentication server.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = (): void => {
        window.location.href = `${backendUrl}/api/auth/google`;
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Create Account</h1>
                <p style={styles.subtitle}>Enter your details to get started</p>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleManualSignUp} style={styles.form}>
                    <input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        minLength={6}
                        required
                    />
                    <button type="submit" disabled={loading} style={styles.submitBtn}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={styles.divider}>OR</div>

                <button onClick={handleGoogleAuth} type="button" style={styles.googleBtn}>
                    <svg style={styles.icon} viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Sign Up with Google
                </button>

                <p style={styles.footerText}>
                    Already have an account?{' '}
                    <Link href="/auth/login" style={styles.link}>
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: { display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f172a', color: '#ffffff' },
    card: { padding: '2.5rem', borderRadius: '12px', backgroundColor: '#1e293b', width: '100%', maxWidth: '420px', textAlign: 'center' },
    title: { fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.5rem' },
    subtitle: { color: '#94a3b8', marginBottom: '1.5rem', fontSize: '0.9rem' },
    error: { backgroundColor: '#ef444420', color: '#f87171', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem' },
    form: { display: 'flex', flexDirection: 'column', gap: '1rem' },
    input: { padding: '0.75rem', borderRadius: '6px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', outline: 'none' },
    submitBtn: { padding: '0.75rem', borderRadius: '6px', border: 'none', backgroundColor: '#2563eb', color: '#fff', fontWeight: '600', cursor: 'pointer' },
    divider: { margin: '1.5rem 0', color: '#64748b', fontSize: '0.8rem', fontWeight: 'bold' },
    googleBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: '600', cursor: 'pointer' },
    icon: { width: '18px', height: '18px' },
    footerText: { marginTop: '1.5rem', fontSize: '0.85rem', color: '#94a3b8' },
    link: { color: '#60a5fa', textDecoration: 'none', fontWeight: 'bold' },
};