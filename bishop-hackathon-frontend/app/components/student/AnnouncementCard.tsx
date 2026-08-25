import React, { JSX } from 'react';

interface AnnouncementProps {
    title: string;
    description: string;
}

export default function AnnouncementCard({ title, description }: AnnouncementProps): JSX.Element {
    return (
        <div style={styles.announcement}>
            <p style={styles.title}>{title}</p>
            <p style={styles.description}>{description}</p>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    announcement: { padding: '1rem', backgroundColor: '#0f172a', borderRadius: '8px', borderLeft: '4px solid #2563eb', marginBottom: '0.75rem' },
    title: { fontWeight: 'bold', margin: '0 0 0.25rem 0', color: '#f8fafc' },
    description: { color: '#94a3b8', fontSize: '0.875rem', margin: 0 },
};