import React, { JSX } from 'react';

interface StatCardProps {
    label: string;
    value: string | number;
}

export default function StatCard({ label, value }: StatCardProps): JSX.Element {
    return (
        <div style={styles.card}>
            <p style={styles.label}>{label}</p>
            <p style={styles.value}>{value}</p>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    card: { backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '12px', border: '1px solid #334155' },
    label: { color: '#94a3b8', fontSize: '0.875rem', margin: 0 },
    value: { fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0', color: '#60a5fa' },
};